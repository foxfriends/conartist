package app.conartist.processor

import app.conartist.annotation.Arg
import app.conartist.annotation.CreateFragment
import com.squareup.kotlinpoet.ClassName
import com.squareup.kotlinpoet.FileSpec
import com.squareup.kotlinpoet.FunSpec
import com.squareup.kotlinpoet.ParameterSpec
import com.squareup.kotlinpoet.ParameterizedTypeName
import com.squareup.kotlinpoet.ParameterizedTypeName.Companion.parameterizedBy
import com.squareup.kotlinpoet.TypeName
import com.squareup.kotlinpoet.asTypeName
import com.squareup.kotlinpoet.jvm.jvmStatic
import java.io.File
import java.lang.RuntimeException
import javax.annotation.processing.AbstractProcessor
import javax.annotation.processing.RoundEnvironment
import javax.annotation.processing.SupportedOptions
import javax.lang.model.SourceVersion
import javax.lang.model.element.Element
import javax.lang.model.element.TypeElement
import javax.lang.model.element.VariableElement
import javax.tools.Diagnostic.Kind.WARNING
import kotlin.reflect.jvm.internal.impl.builtins.jvm.JavaToKotlinClassMap
import kotlin.reflect.jvm.internal.impl.name.FqName

@SupportedOptions(CreateFragmentProcessor.KAPT_KOTLIN_GENERATED_OPTION_NAME)
class CreateFragmentProcessor: AbstractProcessor() {
  override fun getSupportedAnnotationTypes(): MutableSet<String>
    = mutableSetOf(CreateFragment::class.java.canonicalName, Arg::class.java.canonicalName)

  override fun getSupportedSourceVersion(): SourceVersion
    = SourceVersion.RELEASE_8

  override fun process(elements: MutableSet<out TypeElement>?, roundEnvironment: RoundEnvironment?): Boolean {
    roundEnvironment!!
      .getElementsAnnotatedWith(CreateFragment::class.java)
      .filterIsInstance<TypeElement>()
      .forEach { type ->
        val packageName = processingEnv.elementUtils.getPackageOf(type).toString()
        val args = type.enclosedElements
          .filterIsInstance<VariableElement>()
          .filter { it.getAnnotation(Arg::class.java) != null }

        val funCreate = FunSpec.builder("create")
          .receiver(ClassName(packageName, type.asType().asTypeName().toString(), "Companion"))
          .returns(type.asType().asTypeName())
          .addParameters(args.map {
            JavaToKotlinClassMap.INSTANCE.mapJavaToKotlin(FqName(it.asType().asTypeName().toString()))
            ParameterSpec.builder(it.simpleName.toString(), it.asType().asTypeName().toKotlinType()).build()
          })
          .addStatement("val fragment = %T()", type.asType().asTypeName())
          .addStatement("val bundle = android.os.Bundle()")
          .let {
            args.fold(it) { fn, arg ->
              val argType = arg.asType().asTypeName().toKotlinType().toString()
              when (argType) {
                "kotlin.String" -> fn.addStatement("bundle.putString(%S, %N)", arg.simpleName.toString(), arg.simpleName.toString())
                "kotlin.Int" -> fn.addStatement("bundle.putInt(%S, %N)", arg.simpleName.toString(), arg.simpleName.toString())
                "kotlin.collections.List<kotlin.String>" -> fn.addStatement("bundle.putStringArrayList(%S, ArrayList(%N))", arg.simpleName.toString(), arg.simpleName.toString())
                else -> throw RuntimeException("Unimplemented (${argType})")
              }
            }
          }
          .addStatement("fragment.setArguments(bundle)")
          .addStatement("return fragment")
          .build()

        val fileName = "${type.simpleName.toString()}+CreateFragment"
        val directory = File(processingEnv.options[KAPT_KOTLIN_GENERATED_OPTION_NAME]).apply { mkdir() }
        FileSpec.builder(packageName, fileName)
          .addFunction(funCreate)
          .build()
          .writeTo(directory)
      }

    return false
  }

  companion object {
    const val KAPT_KOTLIN_GENERATED_OPTION_NAME = "kapt.kotlin.generated"
  }
}

fun Element.toKotlinType(): TypeName =
  asType().asTypeName().toKotlinType()

fun TypeName.toKotlinType(): TypeName =
  if (this is ParameterizedTypeName) {
    (rawType.toKotlinType() as ClassName)
      .parameterizedBy(*typeArguments.map { it.toKotlinType() }.toTypedArray())
  } else {
    val className = JavaToKotlinClassMap.INSTANCE.mapJavaToKotlin(FqName(toString()))
        ?.asSingleFqName()
        ?.asString()
    if (className == null) {
      this
    } else {
      ClassName.bestGuess(className)
    }
  }
