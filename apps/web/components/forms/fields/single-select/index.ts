import { registerField } from "~/lib/forms/registry/field-registry";

import { SingleSelectFieldInput } from "./single-select-field-input";
import { singleSelectFieldMeta } from "./single-select-field.config";

registerField(singleSelectFieldMeta, SingleSelectFieldInput);
