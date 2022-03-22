import React, { Fragment, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default function AutoComplete(props) {
  const [selected, setSelected] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const FetchUsers = async () => {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (data.status) {
        setUser(data.data);
        console.log(data.data);
      } else {
        alert(data.message);
      }
    };
    FetchUsers();
  }, []);
  useEffect(() => {
    if (props.preset !== undefined) {
      let temp = props.arr.filter((item) => item.username === props.preset);
      setSelected(temp);
    }
  }, [props]);
  const handleSelect = (selected) => {
    setSelected(selected);
    props.handleChange(selected);
  };

  return (
    <Fragment>
      <Form.Group>
        <Typeahead
          id={props.label}
          labelKey={props.label}
          onChange={handleSelect}
          options={props.arr}
          placeholder={props.placeholder}
          selected={selected}
        />
      </Form.Group>
    </Fragment>
  );
}
