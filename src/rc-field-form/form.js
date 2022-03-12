import React from "react";

import FormContext from "./context";
import useForm from "./useForm";
function Form({ initialValues, onFinish, onFinishFailed, children }) {
  let formInstance = useForm();
  formInstance.setCallbacks({
    onFinish,
    onFinishFailed,
  });

  let mountedRef = React.createRef();
  formInstance.setInitialValues(initialValues);

  if (!mountedRef.current) {
    mountedRef.current = true;
  }

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        formInstance.submit();
      }}
    >
      <FormContext.Provider value={formInstance}>
        {children}
      </FormContext.Provider>
    </form>
  );
}

export default Form;
