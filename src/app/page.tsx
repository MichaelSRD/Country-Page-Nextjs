'use client'
import Image from "next/image";
import { Button } from "./components/ButtonRegion";
import { useEffect, useRef, useState } from "react";
import  PaisSkeleton  from "./components/CountrySqueleton";
import Link from "next/link";


interface Country {
  name: {
    common: string
    official: string
  }
  fifa: string
  region: string
  subregion: string
  flags: {
    svg: string
  }
   population: number
  area: number
  independent: boolean
}

export default function Home() {
  const data = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const [statu, setStatu] = useState<boolean | null>(null)
  const [query, setQuery] = useState("")
  const [sort, setSort ]= useState('population')
  const [results, setResults] = useState<Country[]>([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(7)
  const containerRef = useRef<HTMLDivElement>(null)
  const [region, setRegion] = useState<string[]>([])

  useEffect(() => {
    const calculateItemCount = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight
        const itemHeight = 40 // Altura estimada de cada elemento del esqueleto
        const newItemCount = Math.max(5, Math.floor(containerHeight / itemHeight))
        setItemCount(newItemCount)
      }
    }
    calculateItemCount()
    window.addEventListener("resize", calculateItemCount)

    return () => window.removeEventListener("resize", calculateItemCount)
  }, [])

  const searchCountries = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://restcountries.com/v3.1/all`)
      const data = await response.json()

      const filteredCountries = data.filter(
        (country: Country) =>
          country.name.common.toLowerCase().includes(query.toLowerCase()) ||
          country.region.toLowerCase().includes(query.toLowerCase()) ||
          (country.subregion && country.subregion.toLowerCase().includes(query.toLowerCase())),
      )
      setResults(filteredCountries)
    } catch (err) {
      console.error("Error fetching countries:", err)
    } finally {
      setLoading(false)
    }
  }
    const applyFilters = () => {
    let filteredResults = [...results]

    // Apply region filter
    if (region.length > 0) {
      filteredResults = filteredResults.filter((country: Country) => region.includes(country.region))
    }

    // Apply status filter
    if (statu !== null) {
      filteredResults = filteredResults.filter((country: Country) => country.independent === statu)
    }

    // Apply sorting
    filteredResults.sort((a: Country, b: Country) => {
      if (sort === "population") {
        return b.population - a.population
      } else if (sort === "name") {
        return a.name.common.localeCompare(b.name.common)
      } else if (sort === "area") {
        return b.area - a.area
      }
      return 0
    })

    return filteredResults
  }

  // useEffect(() => {
  //   searchCountries()
  // },[query,sort,region,statu])

  useEffect(() => {
    searchCountries()
  }, [query])

  const searchCountryInput = async ()=>{
     try {
      const response = await fetch(`https://restcountries.com/v3.1/all`);
      const data = await response.json();
      const filteredCountries = data.filter(
        (country: Country) =>
          country.name.common.toLowerCase().includes(query.toLowerCase()) ||
          country.region.toLowerCase().includes(query.toLowerCase()) ||
          (country.subregion && country.subregion.toLowerCase().includes(query.toLowerCase())),
      )
      setResults(filteredCountries)
     } catch (error) {
      
     }
  }
 
 const handledInput = (e: string)=>{
     setQuery(e)
    searchCountryInput()
 }

  const handledStatu = (estatu: boolean)=>{
      if (estatu == statu ) {
        setStatu(null)
      }else{
        setStatu(estatu)
      }
      
  }
 const handledRegion = (newRegion: string)=>{
    console.log(region);
    if(region.includes(newRegion)){
      setRegion(prevRegions => prevRegions.filter(region => region !== newRegion)); // Usando función de actualización
      console.log("Regiones actualizadas:", region);
    }else{
      setRegion(prevRegions => [...prevRegions, newRegion]); // Usando función de actualización
    console.log("Regiones actualizadas:", );
    }
    
 }

  return (
    <div>
      <div className=" bg-[#1B1D1F] rounded-lg px-4 py-7 grid grid-cols-1 md:grid-cols-[22%_1fr] gap-4">
        <p>Found {applyFilters().length} countries</p>
        <div className=" flex relative w-full md:w-[45%] mt-4 md:mt-0 justify-end justify-self-end ">
          <Image alt="lupa de busqueda"src="/search.svg" width={25} height={25} className=" absolute top-[50%]  translate-y-[-50%] left-1 "  />
          <input type="text" placeholder="Search by Name, Region, Subregion" onChange={(e)=>handledInput(e.target.value)} className=" md:w-full md-[250px] bg-[#282B30] rounded-lg p-2 w-full pl-9 " />
        </div>
      <div>
        <p className="mt-3">Sort by</p>
        <div>
          <select  onChange={(e)=>setSort(e.target.value)} value={sort}  className=" bg-[#1B1D1F] rounded-lg p-2 w-full mt-2 border-2 border-[#282B30]">
            <option value="population">Population</option>
            <option value="name">Name</option>
            <option value="area">Area(km²)</option>
          </select>
        </div>
        <div className=" mt-3 mb-8 " >
          <p className="mb-2">Region</p>
          <div className="flex flex-wrap  gap-2">
          {data.map((item, index)=>(
            <Button key={index} texto={item} click={()=>handledRegion(item)} />
          ))}
          </div>
        </div>
        <div>
          <p className="mb-2">Status</p>
          <div className="flex items-center space-x-3 ">
            <span className={` cursor-pointer   border-2  flex  rounded-md w-6 h-6 ${ statu == true ? 'bg-[#4E80EE] border-[#4E80EE] ':'border-white'  } `} onClick={()=>handledStatu(true)} > { statu == true && (
              <Image alt="" src="Done_round.svg" width={20} height={20} />
            )  }   </span>
            <p>Member of the United Nations</p>
          </div>
          <div className="flex items-center space-x-3 mt-2 ">
            <span className={`  cursor-pointer  border-2  flex  rounded-md w-6 h-6 ${ statu == false ? 'bg-[#4E80EE] border-[#4E80EE] ':'border-white'  } `} onClick={()=>handledStatu(false)} > { statu == false && (
              <Image alt="" src="Done_round.svg" width={20} height={20} />
            )  }   </span>
            <p>Indepent</p>
          </div>
        </div>
        </div>
        <div ref={containerRef} className="mt-5 shadow-lg pb-3 px-5 rounded-md ">
          <div className=" pb-3 grid md:grid-cols-5  grid-cols-[50px_1fr_1fr_1fr] gap-4 justify-between items-center mb-3  border-b-2 border-[#282B30]">
            <p>Flag</p>
            <p>Name</p>
            <p>Population</p>
            <p>Area (km²)</p>
            <p className=" hidden md:block " >Region</p>
          </div>
          <div className="space-y-3">
          {loading
              ? [...Array(itemCount)].map((_, index) => <PaisSkeleton key={index} />)
              : applyFilters().map((country, index) => (
                  <div key={index} className="grid grid-cols-[max-content_1fr_1fr_1fr] gap-4 items-center justify md:grid-cols-5  ">
                    <Link href={`/detailCountry/${country.fifa }`} >
                    <Image
                      src={country.flags.svg || "/placeholder.svg"}
                      alt={`Flag of ${country.name.common}`}
                      className="rounded-md cursor-pointer "
                      width={50}
                      height={40}
                    />
                     </Link>
                    <p>{country.name.common}</p>
                    <p>{country.population.toLocaleString()}</p>
                    <p>{country.area.toLocaleString()}</p>
                    <p className=" hidden md:block " >{country.region}</p>
                 
                  </div>
                ))}
          </div>  
        </div>
      </div>
    </div>
  );
}
