import React from "react";
import Schema from "./async-validator";
class FormStore {
  constructor(forceReRender) {
    this.forceReRender = forceReRender;
    this.fieldEntities = [];
    this.store = {};
    this.callBacks = Object.create(null);
  }

  registerField = (fieldEntity) => {
    this.fieldEntities.push(fieldEntity);
  };
  setFieldValue = (name, value) => {
    this.store[name] = value;
    this._notifyAllEntities();
  };
  setFieldsValue = (newStore) => {
    this.store = { ...this.store, ...this.newStore };
    this._notifyAllEntities();
  };
  _notifyAllEntities = () => {
    this.fieldEntities.forEach((entity) => entity.onStoreChange());
  };
  getFieldValue = (name) => {
    return this.store[name];
  };
  getFieldsValue = () => {
    return this.store;
  };
  setCallbacks = (callBacks) => {
    this.callBacks = callBacks;
  };
  submit = () => {
    this.validateFields()
      .then((values) => {
        const { onFinish } = this.callBacks;
        if (onFinish) {
          onFinish(values);
        }
      })
      .catch((errorInfo) => {
        let { onFinishFailed } = this.callBacks;
        if (onFinishFailed) {
          onFinishFailed(errorInfo);
        }
      });
  };

  setInitialValues = (initialValues, mounted) => {
    if (!mounted) {
      this.store = { ...initialValues };
    }
  };
  validateFields = () => {
    let values = this.getFieldsValue();
    let descriptor = this.fieldEntities.reduce((descriptor, entity) => {
      let rules = entity.props.rules;
      if (rules && rules.length > 0) {
        let config = rules.reduce((memo, rule) => {
          memo = { ...memo, ...rule };
          return memo;
        }, {});
        descriptor[entity.props.name] = config;
      }
      return descriptor;
    }, {});
    return new Schema(descriptor).validate(values);
  };
  getForm = () => {
    return {
      registerField: this.registerField,
      setFieldValue: this.setFieldValue,
      setFieldsValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      setCallbacks: this.setCallbacks,
      submit: this.submit,
      setInitialValues: this.setInitialValues,
    };
  };
}
function useForm() {
  let [, forceUpdate] = React.useState();
  let formRef = React.useRef();
  if (!formRef.current) {
    const forceReRender = () => {
      forceUpdate({});
    };
    let formInstance = new FormStore(forceReRender);

    formRef.current = formInstance.getForm();
  }

  return formRef.current;
}
export default useForm;
