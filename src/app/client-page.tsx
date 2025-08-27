import ClientLayout from "@/components/ClientLayout";

export default function ClientPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
