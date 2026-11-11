import type { GetServerSideProps } from "next";
import { Seo } from "../src/components/Seo";
import { AdminLogin } from "../src/components/AdminLogin";
import { AdminRawPolls } from "../src/components/AdminRawPolls";
import type { PublicPollRow } from "../src/lib/polls/summarize";
import type { VoteHubSyncDoc } from "../src/lib/votehub/types";

type AdminPageProps =
  | { authed: false }
  | {
      authed: true;
      email: string;
      polls: PublicPollRow[];
      raw: Record<string, unknown>[];
      sync: VoteHubSyncDoc | null;
    };

export default function AdminPage(props: AdminPageProps) {
  return (
    <>
      <Seo title="Admin raw polls" description="Private poll archive for the site administrator." path="/admin" noindex />
      {props.authed ? (
        <AdminRawPolls email={props.email} polls={props.polls} raw={props.raw} sync={props.sync} />
      ) : (
        <AdminLogin />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async ({ req }) => {
  const { verifyAdminSession } = await import("../src/lib/admin/session");
  const session = await verifyAdminSession(req);
  if (!session) {
    return { props: { authed: false } };
  }

  try {
    const { getAdminRawSnapshot } = await import("../src/lib/polls/adminData");
    const snapshot = await getAdminRawSnapshot();
    return { props: { authed: true, email: session.email, ...snapshot } };
  } catch {
    return {
      props: {
        authed: true,
        email: session.email,
        polls: [],
        raw: [],
        sync: null,
      },
    };
  }
};
