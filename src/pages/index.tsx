import type { NextPage } from "next";
import Head from "next/head";
import { Layout, Dashboard } from "../components";
import { useDashboardService } from "app/services";
import { DashboardData } from "app/models/dashboard";

interface HomeProps {
  dashboard: DashboardData
}

const Home: NextPage<HomeProps> = (props: HomeProps) => {
  return (
    <div>
      <Head>
        <title>Vendas App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout titulo="Dashboard">
        <Dashboard
          clientes={props.dashboard.clientes}
          produtos={props.dashboard.produtos}
          vendas={props.dashboard.vendas}
          vendasPorMes={props.dashboard.vendasPorMes}
        />
      </Layout>
    </div>
  );
};

export async function getStaticProps() {

  const dashboardService = useDashboardService();

  const dashboard: DashboardData = await dashboardService.getDashboard();

  return {
    props: {
      dashboard
    },
    revalidate: 60
  };
}

export default Home;
