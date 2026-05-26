import { registerField } from "~/lib/forms/registry/field-registry";

import { RatingFieldInput } from "./rating-field-input";
import { ratingFieldMeta } from "./rating-field.config";

registerField(ratingFieldMeta, RatingFieldInput);
