import { getUserInfo } from "@/lib/actions/user.actions";
import HeaderBox from "@/components/HeaderBox";
import RecentFiles from "@/components/RecentFiles";
import { getFiles } from "@/lib/actions/file.actions";

const Page = async () => {
  const user = await getUserInfo();
  const files = await getFiles();

  if (!files) {
    console.error("Error fetching files");
    return;
  }

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
          <RecentFiles initialFiles={files} />
        </div>
      </div>
    </section>
  );
};

export default Page;