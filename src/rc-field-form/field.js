import React from "react";
import FormContext from "./context";

class Field extends React.Component {
  static contextType = FormContext;
  onStoreChange = () => {
    this.forceUpdate();
  };
  componentDidMount() {
    this.context.registerField(this);
  }
  getControlled(childProps) {
    const { name } = this.props;
    const { getFieldValue, setFieldValue } = this.context;
    return {
      ...childProps,
      onChange: (e) => {
        setFieldValue(name, e.target.value);
        console.log(e.target.value);
        if (this.props.onChange) {
          this.props.onChange(e);
        }
        if (childProps.onChange) {
          childProps.onChange(e);
        }
      },
      value: getFieldValue(name),
    };
  }
  render() {
    const { children } = this.props;

    return React.cloneElement(children, this.getControlled(children.props));
  }
}

export default Field;
