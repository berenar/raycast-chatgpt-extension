import { Action, ActionPanel, Detail, Form, LaunchProps, popToRoot } from "@raycast/api";
import { useState } from "react";

interface FormValues {
  inputField: string;
}

export default function Command(props: LaunchProps<{ draftValues: FormValues }>) {
  const { draftValues } = props;

  const [nameError, setNameError] = useState<string | undefined>();

  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  return (
    <>
      <Detail markdown="**ChatGPT**" />
      <Form
        enableDrafts
        actions={
          <ActionPanel>
            <Action.SubmitForm
              onSubmit={(values: FormValues) => {
                console.log("onSubmit", values);
                popToRoot();
              }}
            />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="inputField"
          title="Prompt"
          defaultValue={draftValues?.inputField ?? "What is Raycast?"}
          error={nameError}
          onChange={dropNameErrorIfNeeded}
          onBlur={(event) => {
            if (event.target.value?.length == 0) {
              setNameError("The field should't be empty!");
            } else {
              dropNameErrorIfNeeded();
            }
          }}
        />
      </Form>
    </>
  );
}
