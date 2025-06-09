'use client'
import Pagination from "@/components/Pagination";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { authUser, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authUser && !loading) {
      router.push("/login");
    }
  }, [authUser, loading, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`/api/categories?page=${page}`);
      const data = await res.json();
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    };
    fetchCategories();
  }, [page]);

  useEffect(() => {
    const fetchUserdata = async () => {
      if (authUser && !loading) {
        const userRes = await fetch(`/api/user/${authUser?._id}`);
        const data = await userRes.json();
        setSelected([...data?.interests]);
      }
    };
    fetchUserdata();
  }, [authUser]);
  const handleToggle = async (categoryId: string) => {
    const res = await fetch(`/api/user/interests/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: authUser?._id }),
    });

    const data = await res.json();
    if (data?.interests) {
      toast.success(data.message)
      setSelected([...data.interests]);
    }
  };

  if (!authUser) return null;

  return (
    <div className="max-w-lg m-auto dark:bg-[#2e2d2b]  border border-[#C1C1C1] md:p-6 p-3 rounded-lg">
      <h2 className="text-[32px] dark:text-white/80 font-bold mb-2 text-center">Please mark your interests!</h2>
      <p className="my-4 border-b dark:text-white/70 border-[#EAEAEA] text-center">We will keep you notified.</p>

      <div className="flex flex-col gap-3 ">
        <h3 className="text-[20px] dark:text-white/80 font-[500]">My saved interests!</h3>
        <div>
          {categories.map((cat) => (
            <label key={cat._id} className="block mb-3 dark:text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(cat._id)}
                onChange={() => handleToggle(cat._id)}
                className="mr-2 text-[16px]"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center space-x-2">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}
