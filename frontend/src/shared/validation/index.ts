import { isReactive, isRef, ref, type Ref } from 'vue'
import * as v from 'valibot'

export function useValidation(schema: any, inputText: unknown) {
  const errorMessage = ref('')
  //const isTouched = ref(false)

  function validate() {
    errorMessage.value = ''

    let result = v.safeParse(schema, inputText.value)

    // if(isRef(inputText)) {
    //   result = v.safeParse(schema, inputText.value)
    // }
    // else if (isReactive(inputText)) {
    //   result = v.safeParse(schema, inputText.value)
    // }
    debugger
    if (result.success) {
      errorMessage.value = ''
    } else {
      const errors = v.flatten(result.issues)

      if (errors.root) {
        errorMessage.value = errors.root?.[0]
      } else if (errors.nested) {
        Object.keys(errors.nested).forEach((item) => {
          errorMessage.value = errors.nested[item][0]
        })
      } else {
        errorMessage.value = ''
      }
    }
  }

  // function handleInput() {
  //   if (isTouched.value) {
  //     validate()
  //   }
  // }

  // function handleBlur() {
  //   if (!isTouched.value) {
  //     validate()
  //     isTouched.value = true
  //   }
  // }

  return { errorMessage, validate }
}
