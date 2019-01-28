---
name: Convention Request
about: Request a new convention be added
title: 'Convention request: [Convention Name Here]'
labels: convention
assignees: OinkIguana

---

Hey, thanks for checking out this form! You taking the time to fill this out when requesting a con
is a huge help! The fenced off sections that start with `toml` are what you should be modifying.

Here's how it goes:

First, some basic information about the con (REQUIRED). Dates are in `YYYY-MM-DD` format.

```toml
title = "Super Convention"
start_date = 2018-12-08
end_date = 2018-12-10
```

Tags won't show up anywhere, but they might someday be used for searching. Put a few in here that can describe this con! Don't worry too much about these. Add or remove as many as you like.
```toml
tags = ["anime", "furry", "comic", "horror", "sports"]
```

The (OPTIONAL) predecessor is a reference to a previous year's version of this convention. Since it's the first year of ConArtist it's unlikely you'll need this now, but if you do happen to be adding a second edition of something, then this number comes from the ConArtist URL for that con. Just leave this commented out (`#`) if you don't need it.

Example:
```
https://conartist.app/convention/189/details
                                 ^ here
```

```toml
#predecessor = 189
```

Hours are OPTIONAL, but nice to have if you can find it! It's most useful if these hours correspond to the times that you'll be selling for.

Each `[[hours]]` section corresponds to one day's hours. They should be in order of date. Just keep adding more `[[hours]]` sections if you need more (or delete some if you don't)

The format for these is `YYYY-MM-DD HH:mm:SS-TimeZone`
(or `YYYY-MM-DD HH:mm:SS+TimeZone` if the con's time zone is positive)

```toml
[[hours]]
start = 2018-12-08 09:00:00-04:00
end   = 2018-12-08 17:00:00-04:00
[[hours]]
start = 2018-12-09 09:00:00-04:00
end   = 2018-12-09 17:00:00-04:00
[[hours]]
start = 2018-12-10 09:00:00-04:00
end   = 2018-12-10 17:00:00-04:00
```

A website is required. The URL should be the actual URL you copied from the browser. The title should be nicer to look at than that URL, but still valid if someone types it in to their browser manually (you don't need the `http(s)://` part or `www`).

```toml
[website]
url = "https://conartist.app"
title = "conartist.app"
```

The address is also required. Try to use a somewhat full country name here, like "United States", not "USA". The city includes the city and short form of province/state. For the actual street address part, the name of the venue is nice to have, and so is the street address. So long as people can find it in Google Maps though it should be good enough.

```
[address]
country = "Canada"
city = "Ottawa, ON"
address = """
Venue Name
123 Somewhere St.
Ottawa, ON, Canada
"""
```

These coordinates are REQUIRED! You can find them by searching for the venue in Google Maps, and taking them from the URL.

Example:
```
https://www.google.ca/maps/place/Googleplex/@37.4219999,-122.0862515,17z/data=...
                                 ^ Venue     ^ Latitude ^ Longitude
```
```toml
[address.coordinates]
lat = 37.4219999
lon = -122.0862515
```
