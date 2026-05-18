import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export default function Page() {
    return <p>Customers Page</p>;
}

export const metadata: Metadata = {
  title: 'Customers',
};