import { registerField } from "~/lib/forms/registry/field-registry";

import { LongTextFieldInput } from "./long-text-field-input";
import { longTextFieldMeta } from "./long-text-field.config";

registerField(longTextFieldMeta, LongTextFieldInput);
