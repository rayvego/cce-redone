import { getUserInfo } from "@/lib/actions/user.actions";
import HeaderBox from "@/components/HeaderBox";
import RecentFiles from "@/components/RecentFiles";
import { getDocuments } from "@/lib/actions/file.actions";

const Page = async () => {
  const user = await getUserInfo();
  const files = await getDocuments(user.emailAddresses[0].emailAddress);

  if (!files) {
    console.error("Error fetching files");
    return;
  }

  console.log(files);

  return (
    <section className={"home"}>
      <div className={"home-content"}>
        <header className={"home-header"}>
          <HeaderBox
            type={"greeting"}
            title={"Welcome"}
            user={user?.firstName}
            subtext={"Code and collaborate smoothly, in real-time with your team."}
          />
        </header>

        <div>
          <RecentFiles initialFiles={files} userId={user.id} email={user.emailAddresses[0].emailAddress} />
        </div>
      </div>
    </section>
  );
};

export default Page;