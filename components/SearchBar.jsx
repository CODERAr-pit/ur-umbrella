'use client'
import { usePathname,useRouter } from "next/navigation";


const SearchBar = () => {
    const router=useRouter();
    const pathname=usePathname();

    const search=(e)=>{
    e.preventDefault();
    const formData=new FormData(e.currentTarget);
    const inputSearchValue= formData.get("inputsearchvalue");
    const params= new URLSearchParams();
    if(inputSearchValue){
        params.set("q",inputSearchValue);
    }
    else{
        params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
};
  return (
    <div className=" w-full max-w-md"> {/* This controls the search bar size */}
    <form onSubmit={search} className="flex gap-0">
      <input
        name="inputsearchvalue"
        type="text"
        className="bg-white text-black text-center border border-gray-200 rounded-md rounded-r-none px-4 py-2 w-full outline-none focus:border-blue-500 transition"
        placeholder="Search Product Here!!"
      />
      <button type="submit" className="bg-slate-100 rounded-l-none p-2 rounded-lg">Go</button>
      </form>
    </div>
  )
}
export default SearchBar