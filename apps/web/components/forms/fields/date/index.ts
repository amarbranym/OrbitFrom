import { registerField } from "~/lib/forms/registry/field-registry";

import { DateFieldInput } from "./date-field-input";
import { dateFieldMeta } from "./date-field.config";

registerField(dateFieldMeta, DateFieldInput);
