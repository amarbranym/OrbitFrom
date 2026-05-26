import { registerField } from "~/lib/forms/registry/field-registry";

import { TextFieldInput } from "./text-field-input";
import { textFieldMeta } from "./text-field.config";

registerField(textFieldMeta, TextFieldInput);

export { TextFieldInput, textFieldMeta };
