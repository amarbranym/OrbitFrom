import { registerField } from "~/lib/forms/registry/field-registry";

import { CheckboxFieldInput } from "./checkbox-field-input";
import { checkboxFieldMeta } from "./checkbox-field.config";

registerField(checkboxFieldMeta, CheckboxFieldInput);
