import { useData } from 'vike-react/useData';

import type { Data } from './+data';

export default function Page() {
  const { simpleText } = useData<Data>();

  return (
    <>
      <h1 className={'font-bold text-3xl pb-4'}>{simpleText}</h1>
    </>
  );
}
