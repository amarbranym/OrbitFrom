import { registerField } from "~/lib/forms/registry/field-registry";

import { EmailFieldInput } from "./email-field-input";
import { emailFieldMeta } from "./email-field.config";

registerField(emailFieldMeta, EmailFieldInput);
