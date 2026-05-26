import { registerField } from "~/lib/forms/registry/field-registry";

import { MultiSelectFieldInput } from "./multi-select-field-input";
import { multiSelectFieldMeta } from "./multi-select-field.config";

registerField(multiSelectFieldMeta, MultiSelectFieldInput);
