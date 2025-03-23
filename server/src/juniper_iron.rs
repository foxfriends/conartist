#![doc = include_str!("../README.md")]

use std::{error::Error, fmt, io::Read, ops::Deref as _};

use iron::{
    headers::ContentType,
    itry, method,
    middleware::Handler,
    mime::{Mime, TopLevel},
    prelude::*,
    status,
};
use juniper::{
    DefaultScalarValue, GraphQLType, InputValue, RootNode, ScalarValue, http,
    http::GraphQLBatchRequest,
};
use serde_json::error::Error as SerdeError;
use urlencoded::{UrlDecodingError, UrlEncodedQuery};

/// Handler that executes `GraphQL` queries in the given schema
///
/// The handler responds to GET requests and POST requests only. In GET
/// requests, the query should be supplied in the `query` URL parameter, e.g.
/// `http://localhost:3000/graphql?query={hero{name}}`.
///
/// POST requests support both queries and variables. POST a JSON document to
/// this endpoint containing the field `"query"` and optionally `"variables"`.
/// The variables should be a JSON object containing the variable to value
/// mapping.
pub struct GraphQLHandler<
    'a,
    CtxFactory,
    Query,
    Mutation,
    Subscription,
    CtxT,
    S = DefaultScalarValue,
> where
    S: ScalarValue,
    CtxFactory: Fn(&mut Request) -> IronResult<CtxT> + Send + Sync + 'static,
    CtxT: 'static,
    Query: GraphQLType<S, Context = CtxT> + Send + Sync + 'static,
    Mutation: GraphQLType<S, Context = CtxT> + Send + Sync + 'static,
    Subscription: GraphQLType<S, Context = CtxT> + Send + Sync + 'static,
{
    context_factory: CtxFactory,
    root_node: RootNode<'a, Query, Mutation, Subscription, S>,
}

/// Handler that renders `GraphiQL` - a graphical query editor interface
pub struct GraphiQLHandler {
    graphql_url: String,
    subscription_url: Option<String>,
}

/// Handler that renders `GraphQL Playground` - a graphical query editor interface
pub struct PlaygroundHandler {
    graphql_url: String,
    subscription_url: Option<String>,
}

fn get_single_value<T>(mut values: Vec<T>) -> IronResult<T> {
    if values.len() == 1 {
        Ok(values.remove(0))
    } else {
        Err(GraphQLIronError::InvalidData("Duplicate URL query parameter").into())
    }
}

fn parse_url_param(params: Option<Vec<String>>) -> IronResult<Option<String>> {
    if let Some(values) = params {
        get_single_value(values).map(Some)
    } else {
        Ok(None)
    }
}

fn parse_variable_param<S>(params: Option<Vec<String>>) -> IronResult<Option<InputValue<S>>>
where
    S: ScalarValue,
{
    params
        .map(|vals| {
            serde_json::from_str::<InputValue<S>>(get_single_value(vals)?.as_ref())
                .map_err(|e| GraphQLIronError::Serde(e).into())
        })
        .transpose()
}

impl<'a, CtxFactory, Query, Mutation, Subscription, CtxT, S>
    GraphQLHandler<'a, CtxFactory, Query, Mutation, Subscription, CtxT, S>
where
    S: ScalarValue + Send + Sync + 'static,
    CtxFactory: Fn(&mut Request) -> IronResult<CtxT> + Send + Sync + 'static,
    CtxT: Send + Sync + 'static,
    Query: GraphQLType<S, Context = CtxT, TypeInfo = ()> + Send + Sync + 'static,
    Mutation: GraphQLType<S, Context = CtxT, TypeInfo = ()> + Send + Sync + 'static,
    Subscription: GraphQLType<S, Context = CtxT, TypeInfo = ()> + Send + Sync + 'static,
{
    /// Build a new GraphQL handler
    ///
    /// The context factory will receive the Iron request object and is
    /// expected to construct a context object for the given schema. This can
    /// be used to construct e.g. database connections or similar data that
    /// the schema needs to execute the query.
    pub fn new(
        context_factory: CtxFactory,
        query: Query,
        mutation: Mutation,
        subscription: Subscription,
    ) -> Self {
        GraphQLHandler {
            context_factory,
            root_node: RootNode::new_with_scalar_value(query, mutation, subscription),
        }
    }

    fn handle_get(&self, req: &mut Request) -> IronResult<GraphQLBatchRequest<S>> {
        let url_query = req
            .get_mut::<UrlEncodedQuery>()
            .map_err(GraphQLIronError::Url)?;

        let query = parse_url_param(url_query.remove("query"))?
            .ok_or(GraphQLIronError::InvalidData("No query provided"))?;
        let operation_name = parse_url_param(url_query.remove("operationName"))?;
        let variables = parse_variable_param(url_query.remove("variables"))?;

        Ok(GraphQLBatchRequest::Single(http::GraphQLRequest::new(
            query,
            operation_name,
            variables,
        )))
    }

    fn handle_post_json(&self, req: &mut Request) -> IronResult<GraphQLBatchRequest<S>> {
        let mut payload = String::new();
        itry!(req.body.read_to_string(&mut payload));

        Ok(
            serde_json::from_str::<GraphQLBatchRequest<S>>(payload.as_str())
                .map_err(GraphQLIronError::Serde)?,
        )
    }

    fn handle_post_graphql(&self, req: &mut Request) -> IronResult<GraphQLBatchRequest<S>> {
        let mut payload = String::new();
        itry!(req.body.read_to_string(&mut payload));

        Ok(GraphQLBatchRequest::Single(http::GraphQLRequest::new(
            payload, None, None,
        )))
    }

    fn execute_sync(
        &self,
        context: &CtxT,
        request: GraphQLBatchRequest<S>,
    ) -> IronResult<Response> {
        let response = request.execute_sync(&self.root_node, context);
        let content_type = "application/json".parse::<Mime>().unwrap();
        let json = serde_json::to_string_pretty(&response).unwrap();
        let status = if response.is_ok() {
            status::Ok
        } else {
            status::BadRequest
        };
        Ok(Response::with((content_type, status, json)))
    }
}

impl GraphiQLHandler {
    /// Build a new GraphiQL handler targeting the specified URL.
    ///
    /// The provided URL should point to the URL of the attached `GraphQLHandler`. It can be
    /// relative, so a common value could be `"/graphql"`.
    pub fn new(graphql_url: &str, subscription_url: Option<&str>) -> GraphiQLHandler {
        GraphiQLHandler {
            graphql_url: graphql_url.into(),
            subscription_url: subscription_url.map(Into::into),
        }
    }
}

impl PlaygroundHandler {
    /// Build a new GraphQL Playground handler targeting the specified URL.
    ///
    /// The provided URL should point to the URL of the attached `GraphQLHandler`. It can be
    /// relative, so a common value could be `"/graphql"`.
    pub fn new(graphql_url: &str, subscription_url: Option<&str>) -> PlaygroundHandler {
        PlaygroundHandler {
            graphql_url: graphql_url.into(),
            subscription_url: subscription_url.map(Into::into),
        }
    }
}

impl<CtxFactory, Query, Mutation, Subscription, CtxT, S> Handler
    for GraphQLHandler<'static, CtxFactory, Query, Mutation, Subscription, CtxT, S>
where
    S: ScalarValue + Sync + Send + 'static,
    CtxFactory: Fn(&mut Request) -> IronResult<CtxT> + Send + Sync + 'static,
    CtxT: Send + Sync + 'static,
    Query: GraphQLType<S, Context = CtxT, TypeInfo = ()> + Send + Sync + 'static,
    Mutation: GraphQLType<S, Context = CtxT, TypeInfo = ()> + Send + Sync + 'static,
    Subscription: GraphQLType<S, Context = CtxT, TypeInfo = ()> + Send + Sync + 'static,
{
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let context = (self.context_factory)(req)?;

        let graphql_request = match req.method {
            method::Get => self.handle_get(req)?,
            method::Post => match req.headers.get::<ContentType>().map(ContentType::deref) {
                Some(Mime(TopLevel::Application, sub_lvl, _)) => match sub_lvl.as_str() {
                    "json" => self.handle_post_json(req)?,
                    "graphql" => self.handle_post_graphql(req)?,
                    _ => return Ok(Response::with(status::BadRequest)),
                },
                _ => return Ok(Response::with(status::BadRequest)),
            },
            _ => return Ok(Response::with(status::MethodNotAllowed)),
        };

        self.execute_sync(&context, graphql_request)
    }
}

impl Handler for GraphiQLHandler {
    fn handle(&self, _: &mut Request) -> IronResult<Response> {
        let content_type = "text/html; charset=utf-8".parse::<Mime>().unwrap();

        Ok(Response::with((
            content_type,
            status::Ok,
            juniper::http::graphiql::graphiql_source(
                &self.graphql_url,
                self.subscription_url.as_deref(),
            ),
        )))
    }
}

impl Handler for PlaygroundHandler {
    fn handle(&self, _: &mut Request) -> IronResult<Response> {
        let content_type = "text/html; charset=utf-8".parse::<Mime>().unwrap();

        Ok(Response::with((
            content_type,
            status::Ok,
            juniper::http::playground::playground_source(
                &self.graphql_url,
                self.subscription_url.as_deref(),
            ),
        )))
    }
}

#[derive(Debug)]
enum GraphQLIronError {
    Serde(SerdeError),
    Url(UrlDecodingError),
    InvalidData(&'static str),
}

impl fmt::Display for GraphQLIronError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            GraphQLIronError::Serde(err) => fmt::Display::fmt(err, f),
            GraphQLIronError::Url(err) => fmt::Display::fmt(err, f),
            GraphQLIronError::InvalidData(err) => fmt::Display::fmt(err, f),
        }
    }
}

impl Error for GraphQLIronError {
    fn cause(&self) -> Option<&dyn Error> {
        match *self {
            GraphQLIronError::Serde(ref err) => Some(err),
            GraphQLIronError::Url(ref err) => Some(err),
            GraphQLIronError::InvalidData(_) => None,
        }
    }
}

impl From<GraphQLIronError> for IronError {
    fn from(err: GraphQLIronError) -> IronError {
        let message = err.to_string();
        IronError::new(err, (status::BadRequest, message))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use iron::{
        Handler, Headers, Url,
        headers::ContentType,
        mime::{Mime, SubLevel, TopLevel},
    };
    use iron_test::{request, response};
    use percent_encoding::{AsciiSet, CONTROLS, utf8_percent_encode};

    use juniper::{
        DefaultScalarValue, EmptyMutation, EmptySubscription,
        http::tests as http_tests,
        tests::fixtures::starwars::schema::{Database, Query},
    };

    use super::GraphQLHandler;

    /// https://url.spec.whatwg.org/#query-state
    const QUERY_ENCODE_SET: &AsciiSet = &CONTROLS.add(b' ').add(b'"').add(b'#').add(b'<').add(b'>');

    // This is ugly but it works. `iron_test` just dumps the path/url in headers
    // and newer `hyper` doesn't allow unescaped "{" or "}".
    fn fixup_url(url: &str) -> String {
        let url = Url::parse(&format!("http://localhost:3000{url}")).expect("url to parse");
        let path: String = url
            .path()
            .iter()
            .map(|x| x.to_string())
            .collect::<Vec<_>>()
            .join("/");
        format!(
            "http://localhost:3000{path}?{}",
            utf8_percent_encode(url.query().unwrap_or(""), QUERY_ENCODE_SET),
        )
    }

    struct TestIronIntegration;

    impl http_tests::HttpIntegration for TestIronIntegration {
        fn get(&self, url: &str) -> http_tests::TestResponse {
            request::get(&fixup_url(url), Headers::new(), &make_handler())
                .map(make_test_response)
                .unwrap_or_else(make_test_error_response)
        }

        fn post_json(&self, url: &str, body: &str) -> http_tests::TestResponse {
            let mut headers = Headers::new();
            headers.set(ContentType::json());
            request::post(&fixup_url(url), headers, body, &make_handler())
                .map(make_test_response)
                .unwrap_or_else(make_test_error_response)
        }

        fn post_graphql(&self, url: &str, body: &str) -> http_tests::TestResponse {
            let mut headers = Headers::new();
            headers.set(ContentType(Mime(
                TopLevel::Application,
                SubLevel::Ext("graphql".into()),
                vec![],
            )));
            request::post(&fixup_url(url), headers, body, &make_handler())
                .map(make_test_response)
                .unwrap_or_else(make_test_error_response)
        }
    }

    #[test]
    fn test_iron_integration() {
        let integration = TestIronIntegration;

        http_tests::run_http_test_suite(&integration);
    }

    fn context_factory(_: &mut Request) -> IronResult<Database> {
        Ok(Database::new())
    }

    fn make_test_error_response(_: IronError) -> http_tests::TestResponse {
        // For now all errors return the same status code.
        // `juniper_iron` users can choose to do something different if desired.
        http_tests::TestResponse {
            status_code: 400,
            body: None,
            content_type: "application/json".into(),
        }
    }

    fn make_test_response(response: Response) -> http_tests::TestResponse {
        let status_code = response
            .status
            .expect("No status code returned from handler")
            .to_u16() as i32;
        let content_type = String::from_utf8(
            response
                .headers
                .get_raw("content-type")
                .expect("No content type header from handler")[0]
                .clone(),
        )
        .expect("Content-type header invalid UTF-8");
        let body = response::extract_body_to_string(response);

        http_tests::TestResponse {
            status_code,
            body: Some(body),
            content_type,
        }
    }

    fn make_handler() -> Box<dyn Handler> {
        Box::new(<GraphQLHandler<_, _, _, _, _, DefaultScalarValue>>::new(
            context_factory,
            Query,
            EmptyMutation::<Database>::new(),
            EmptySubscription::<Database>::new(),
        ))
    }
}
