import { Action, ActionPanel, Form, getPreferenceValues, LaunchProps, showToast, Toast } from "@raycast/api";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

interface Preferences {
  openAiApiKey: string;
}

interface FormValues {
  inputField: string;
}

const configuration = new Configuration({
  apiKey: getPreferenceValues<Preferences>().openAiApiKey,
});
const openAI = new OpenAIApi(configuration);

export default function Command(props: LaunchProps<{ draftValues: FormValues }>) {
  async function handleSubmit(values: FormValues): Promise<string> {
    setIsLoading(true);
    try {
      const completion = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: values.inputField }],
      });

      const result = completion.data.choices[0].message?.content ?? "";
      setIsLoading(false);
      return result.trim();
    } catch (error) {
      setIsLoading(false);
      await showToast({
        style: Toast.Style.Failure,
        title: "Error:",
        message: "Something went wrong",
      });
      return "";
    }
  }

  const { draftValues } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nameError, setNameError] = useState<string | undefined>();

  const [answerValue, setAnswerValue] = useState<string | undefined>("");

  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  return (
    <>
      <Form
        enableDrafts
        isLoading={isLoading}
        actions={
          <ActionPanel>
            <Action.SubmitForm
              onSubmit={async (values: FormValues) => {
                const res = await handleSubmit(values);
                setAnswerValue(res);
              }}
            />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="inputField"
          title="Prompt"
          placeholder="Fill with your request"
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
        <Form.TextField
          id="answerField"
          title="Answer"
          value={answerValue}
          onChange={setAnswerValue}
          placeholder="Don't fill, the answer will appear here"
        />
      </Form>
    </>
  );
}
