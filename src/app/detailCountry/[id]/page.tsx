'use client'
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"


interface Country {
    name: {
      common: string
      official: string
    }
    region: string
    subregion: string
    fifa: string
    flags: {
      svg: string
    }
    languages:{
        [key: string]: string
    }
    continents: string
    capital: string
     population: number
    area: number
    currencies: {
        [key: string]: {
            name: string
            symbol: string
        }
    }
    borders: string[]
    independent: boolean
  }

export default function CountryDetail( ){

    const params = useParams();  // Get the params using useParams()
    const id = params.id;       // Access params.id
   const [result, setResult] = useState<Country | null>(null);
   const [bordersData, setBordersData] = useState<Country[]>([]);
   
   useEffect(() => {
    console.log(id);
    const fetchData = async () => {
      try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${id}`)
        const data = await res.json()
        setResult(data[0])
         
        if (data[0]?.borders) {
          const borderCountries = await Promise.all(
            data[0].borders.map( async (borderCode: string): Promise<Country>  =>{
                const borderRes = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                const borderData = await borderRes.json();
                return borderData[0];
            })
          );
          setBordersData(borderCountries);
            
        }


      } catch (error) {
        console.error("Error fetching country data:", error)
      }
    }

    fetchData()
  }, [id]);

    const getLanguages = (languages: { [key: string]: string } | undefined) => {
        if (!languages) return "N/A"
        return Object.values(languages).join(", ")
      }
    
      const getCurrencies = (currencies: Country["currencies"] | undefined) => {
        if (!currencies) return "N/A"
        return Object.values(currencies)
          .map((currency) => currency.name)
          .join(", ")
      }
  
    return (
        <div className="bg-[#1B1D1F] flex m-auto justify-center w-full" >
        <div className=" text-center relative w-[33rem] md:w-[50rem]  bg-[#1B1D1F] border border-[#6C727F] rounded-md  p-4 -top-12 " >
           <Image src={result?.flags.svg || "/placeholder.svg" } alt="" width={200} height={200} className=" relative -top-16 left-[50%] -translate-x-1/2 rounded-md " />
           <h1 className=" text-2xl font-bold " >{result?.name.common}</h1>
           <p>{result?.name.official}</p>
           <div className=" flex border-b border-[#282B30] p-4 space-x-4  justify-center  " >
            <div className=" flex rounded-md bg-[#282B30] p-2 " >
                <p className=" pr-2 border-r-2 border-[#1B1D1F] ">Population</p>
                <p className=" pl-2 " >{result?.population.toLocaleString()}</p>
            </div>
            <div className=" flex rounded-md bg-[#282B30] p-2 " >
                <p className=" pr-2 border-r-2 border-[#1B1D1F] ">Area (km²)</p>
                <p className=" pl-2 " >{result?.area.toLocaleString()}</p>
            </div>
           </div>
           <div className="flex justify-between border-b p-3  border-[#282B30] " ><p>Capital</p><p>{result?.capital}</p></div>
           <div className="flex justify-between border-b p-3  border-[#282B30] " ><p>Subregion</p><p>{result?.subregion}</p></div>
           <div className="flex justify-between border-b p-3  border-[#282B30] " ><p>Language</p><p>{getLanguages(result?.languages)}</p></div>
           <div className="flex justify-between border-b p-3  border-[#282B30] " ><p>Currenci</p><p>{getCurrencies(result?.currencies)}</p></div>
           <div className="flex justify-between border-b p-3  border-[#282B30] " ><p>Continents</p><p>{result?.continents}</p></div>
           <div>
            <p className=" mb-3 text-left pl-3 mt-3 "  >Neighbouring Countries</p>
            <div className=" flex flex-wrap gap-2  pl-3">
               {bordersData.map((border)=>(
                <div key={border.name.common} className="flex flex-col items-center" >
                  <Link href={`/detailCountry/${border.fifa}  ` } className="relative w-full h-10 cursor-pointer " >
                    <Image src={border.flags.svg} alt="" fill className=" rounded-sm object-cover " />
                    </Link>
                  <p>{border.name.common}</p>
                </div>
               )) }
            </div>
           </div>
        </div>
        </div>
        
    )
}