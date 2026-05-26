import { registerField } from "~/lib/forms/registry/field-registry";

import { NumberFieldInput } from "./number-field-input";
import { numberFieldMeta } from "./number-field.config";

registerField(numberFieldMeta, NumberFieldInput);
