import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/publicHome";
import connectDb from "@/lib/db";
import User from "@/models/user.model";



export default async function Home() {
  const session = await auth();
  await connectDb()
  const user = await User.findOne({ email: session?.user?.email })

  const plainUser = JSON.parse(JSON.stringify(user))
  return (
    <div className="w-full min-h-screen bg-white">
      <Nav />
      {user?.role == "partner" ? <PartnerDashboard /> : (user?.role == "Admin" ? <AdminDashboard /> : <PublicHome />)}
      <Footer />
    </div>
  );
}
