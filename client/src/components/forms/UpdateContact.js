import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_PERSON, GET_PEOPLE } from "../../graphql/queries";

const UpdateContact = ({ id, firstName, lastName, onButtonClick }) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  const { loading, error } = useQuery(GET_PEOPLE);
  const [updateContact] = useMutation(UPDATE_PERSON);

  const onFinish = async (values) => {
    const { firstName, lastName } = values;

    const optimisticPerson = { id, firstName, lastName };
    try {
      // Update contact mutation
      await updateContact({
        variables: { id, firstName, lastName },
        update: (cache, { data: { updatePerson: updatedPerson } }) => {
          const existingData = cache.readQuery({ query: GET_PEOPLE });
          const updatedPeople = existingData.people.map((person) => {
            if (person.id === updatedPerson.id) {
              return { ...person, ...updatedPerson };
            }
            return person;
          });
          cache.writeQuery({
            query: GET_PEOPLE,
            data: { people: updatedPeople },
          });
        },
      });
      // Reset form
      form.resetFields();
      // Trigger parent component action
      onButtonClick();
    } catch (err) {
      console.error("Error updating contact:", err);
    }
  };

  useEffect(() => {
    forceUpdate({});
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <Form
      form={form}
      name="update-contact-form"
      layout="inline"
      onFinish={onFinish}
      initialValues={{ firstName, lastName }}
    >
      <Form.Item
        name="firstName"
        rules={[{ required: true, message: "Please enter a first name" }]}
      >
        <Input placeholder="i.e. John" />
      </Form.Item>
      <Form.Item
        name="lastName"
        rules={[{ required: true, message: "Please enter a last name" }]}
      >
        <Input placeholder="i.e. Smith" />
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <>
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length > 0
              }
            >
              Update Contact
            </Button>
            <Button onClick={onButtonClick} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </>
        )}
      </Form.Item>
    </Form>
  );
};

export default UpdateContact;
