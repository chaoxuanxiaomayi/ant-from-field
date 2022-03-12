import React from "react";
import ReactDom from "react-dom";
import Form, { Field } from "./rc-field-form";

function App() {
  return (
    <Form
      initialValues={{
        username: "",
        password: "",
      }}
      onFinish={(data) => {
        console.log(data, "onFinish");
      }}
      onFinishFailed={(error) => {
        console.log(error);
      }}
    >
      <Field name="username" rules={[{required:true,min:3,max:6}]}>
        <input type={"text"} />
      </Field>
      <Field name="password" rules={[{ required: true }]}>
        <input type={"text"} />
      </Field>
      <button>submit</button>
    </Form>
  );
}

ReactDom.render(<App />, document.getElementById("root"));
