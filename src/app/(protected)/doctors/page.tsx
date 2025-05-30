import { Button } from "@/src/components/ui/button";
import { PageActions, PageContainer, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/src/components/ui/page-container";
import { Plus } from "lucide-react";

const DoctorsPage = () => {
    return ( 
        <div >
            <PageContainer>
                <PageHeader>
                    
                        <PageHeaderContent>
                            <PageTitle>Médicos</PageTitle>
                            <PageDescription>Gerencie os médicos de sua clínica.</PageDescription>
                        </PageHeaderContent>
                        <PageActions>
                           <Button  size="sm">
                            <Plus>
                                
                            </Plus>
                                Adicionar Médico
                            </Button>
                        </PageActions>
                </PageHeader>
            </PageContainer>
            
        </div>
     );
}
 
export default DoctorsPage;