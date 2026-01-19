import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { BasePageShell } from "~/components/layout/BasePage/BasePageShell";

interface BasePageProps {
  params: Promise<{ baseId: string }>;
}

// Params is passed by the app router with the value [baseId]
export default async function BasePage({ params }: BasePageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { baseId } = await params;
  return <BasePageShell baseId={baseId} />;
}