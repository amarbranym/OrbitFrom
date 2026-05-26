import { AuthService } from "@repo/services/auth";
import {
  AnalyticsService,
  FormService,
  SubmissionService,
} from "@repo/services/forms";
import { NotificationService } from "@repo/services/email/notification-service";
import UserService from "@repo/services/user";

export const userService = new UserService();
export const authService = new AuthService();
export const formService = new FormService();
export const submissionService = new SubmissionService();
export const analyticsService = new AnalyticsService();
export const notificationService = new NotificationService();
