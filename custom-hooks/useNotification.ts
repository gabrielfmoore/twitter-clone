import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsRead,
} from "@/services/notifications";

export const useGetNotifications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId!),
    enabled: !!userId,
  });
};

export const useUnreadNotificationCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["unreadNotificationCount", userId],
    queryFn: () => getUnreadNotificationCount(userId!),
    enabled: !!userId,
    refetchInterval: 30000,
  });
};

export const useCreateNotification = () => {
  return useMutation({
    mutationFn: createNotification,
  });
};

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => markNotificationsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
