export default mockSearchResponse = () => {
  return {
    total: 3,
    results: [
    {
      id: "1",
      i94_country_or_region: "China",
      date: "2001-03",
      country: "China",
      world_region: [
        "Asia Pacific",
        "East Asia",
        "Asia"
      ],
      ntto_group: [
        "Non-Visa Waiver",
        "APEC",
        "PATA",
        "Overseas"
      ],
      total_arrivals: 18786,
      business_visa_arrivals: 10992,
      pleasure_visa_arrivals: 6765,
      student_visa_arrivals: 1020,
      ports_arrivals: [
        {
            port: "Agana, GU",
            "amount": 303
        },
        {
            port: "Atlanta, GA",
            "amount": 39
        },
      ]
    },
    {
      id: "2",
      i94_country_or_region: "China",
      date: "2001-09",
      country: "China",
      world_region: [
        "Asia Pacific",
        "East Asia",
        "Asia"
      ],
      ntto_group: [
        "Non-Visa Waiver",
        "APEC",
        "PATA",
        "Overseas"
      ],
      total_arrivals: 18240,
      business_visa_arrivals: 8289,
      pleasure_visa_arrivals: 7436,
      student_visa_arrivals: 2505,
      ports_arrivals: [
        {
            port: "Agana, GU",
            amount: 226
        },
        {
            port: "Atlanta, GA",
            amount: 32
        },
      ]
    },
    {
      id: "3",
      i94_country_or_region: "Foo",
      date: "2001-09",
      country: null,
      world_region: null,
      ntto_group: null,
      total_arrivals: null,
      business_visa_arrivals: null,
      pleasure_visa_arrivals: null,
      student_visa_arrivals: null,
      ports_arrivals: null
    }
}