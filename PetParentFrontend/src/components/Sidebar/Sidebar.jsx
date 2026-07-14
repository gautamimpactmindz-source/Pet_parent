"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Sidebar.css";
import { useLogoutAdminMutation } from "@/apis/adminAuthApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutAdmin, { }] = useLogoutAdminMutation();
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Pets", path: "/admin/pets" },
    { name: "Content", path: "/admin/content" },
    { name: "Settings", path: "/admin/settings" },
    {name:"Breed",path:"/admin/breed"}
  ];

  const handleLogout = async () => {
    try {
      const logout = await logoutAdmin().unwrap();
      const { message, status } = logout;
      if (status) {
        toast.success(message, { style: { width: '400px' } })
        router.push("/admin/login");
      }
    } catch (err) {
      console.log(err)
      toast.error(err.data.message)
    }

  }

  return (
    <div className="sidebar">
      <div>
        <h2 className="logo">PetParents</h2>

        <ul>
          {menu.map((item) => (
            <li
              key={item.name}
              className={pathname === item.path ? "active" : ""}
            >
              <Link href={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="profile-box">
        <div className="profile-info">
          <strong>Alice Johnson</strong>
          <span>Super Admin</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </div>
    </div>
  );
}
