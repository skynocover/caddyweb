import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/client';
import { AppContext } from '../components/AppContext';
import { getSession } from 'next-auth/client';
import { Notification } from '../components/Notification';
import { prisma } from '../database/db';

export default function Index({
  services,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();
  const [session, loading] = useSession();

  React.useEffect(() => {
    if (!loading && !session) {
      signIn();
    } else if (!loading && session) {
      if (error) {
        Notification.add('error', error);
      } else {
        appCtx.setDataSource(services);
      }
      router.push('/Home');
    }
  }, [loading, session]);
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  try {
    const session = await getSession({ req });
    if (!session) return { props: {} };

    const services = await prisma.service.findMany({
      select: { id: true, name: true, domain: true, port: true, Handlers: true },
    });
    return { props: { services } };
  } catch (error: any) {
    return { props: { error: error.message } };
  }
};
