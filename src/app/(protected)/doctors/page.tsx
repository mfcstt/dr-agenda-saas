import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/src/components/ui/page-container";
import { auth } from "@/src/lib/auth";

import AddDoctorButton from "./_components/add-doctor-button";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  {
    if (!session?.user) {
      redirect("/authentication");
    }
    if (!session.user.clinic) {
      redirect("/dashboard");
    }

    return (
      <div>
        <PageContainer>
          <PageHeader>
            <PageHeaderContent>
              <PageTitle>Médicos</PageTitle>
              <PageDescription>
                Gerencie os médicos de sua clínica.
              </PageDescription>
            </PageHeaderContent>
            <PageActions>
              <AddDoctorButton />
            </PageActions>
          </PageHeader>
        </PageContainer>
      </div>
    );
  }
};

export default DoctorsPage;
