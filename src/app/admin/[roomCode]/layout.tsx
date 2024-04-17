const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <audio src="/song.webm" loop autoPlay />
      {children}
    </>
  );
};

export default AdminLayout;
