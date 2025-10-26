
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormSchema, type ProfileFormValues } from "@/lib/validators";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useTransition } from "react";
import { updateUserProfile } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/services/database";
import { Skeleton } from "../ui/skeleton";

export function ProfileForm() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isLoading, startLoadingTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      displayName: "",
      photoURL: "",
      bio: "",
      tags: "",
      socialHandle: "",
    },
  });

  useEffect(() => {
    if (user) {
      startLoadingTransition(async () => {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          form.reset({
            displayName: userProfile.displayName || user.displayName || "",
            photoURL: userProfile.photoURL || user.photoURL || "",
            bio: userProfile.bio || "",
            tags: userProfile.tags || "",
            socialHandle: userProfile.socialHandle || "",
          });
        }
      });
    }
  }, [user, form]);


  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      const { error } = await updateUserProfile(values);
      if (error) {
        toast({
          title: "Update failed",
          description: error,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
    });
  }

  // TODO: Implement file upload logic
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast({
        title: "Coming Soon!",
        description: "Image uploads are not yet implemented.",
    });
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Profile</CardTitle>
        <CardDescription>Customize how your profile appears to brands.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={form.watch('photoURL') || user?.photoURL || undefined} />
                            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline" onClick={() => document.getElementById('photoURL-input')?.click()}><Upload className="mr-2" /> Change Picture</Button>
                        <Input id="photoURL-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                        <Label htmlFor="handle">Username</Label>
                        <div className="relative">
                            <Input id="handle" defaultValue={user?.displayName?.toLowerCase().replace(' ', '') || 'username'} className="pl-7" readOnly disabled />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                        </div>
                    </div>
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Niches / Tags</FormLabel>
                      <FormControl>
                         <Input {...field} />
                      </FormControl>
                       <p className="text-xs text-muted-foreground">Separate tags with a comma.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                    control={form.control}
                    name="socialHandle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Primary Social Media Link</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
