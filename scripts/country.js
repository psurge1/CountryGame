class Country {
    constructor(name, population = 0, landArea = 0, treasury = 0, income = 0, ideology = 0, resources = 0, cities = 0, wars = 0, experience = wars*0.85)
    {
        this.properties = {
            name: name,
            population: population,
            landArea: landArea,
            treasury: treasury,
            income: income,
            ideology: this.setIdeology(ideology),
            resources: resources,
            cities: cities,
            wars: wars,
            experience: experience,
            _constant: 2*Math.PI/Math.sqrt(3),
            _warExhaustion: this.calcWarExhaustion(),
            _stability: this.calcStability(),
            _factories: this.calcFactories(),
            _development: this.calcDevelopment(),
            __power: this.calcPower()
        };
    }

    /**
     * Completes all required steps to update the country
     * @return {boolean} depicting if successful or not
     */
    do()
    {
        this.incrementTreasury(this.getIncome(), 'A');
    }

    /**
     * Calculates the power index of a country given its war exhaustion, factories, development, and stability
     * @return {float} power index
     */
    calcPower()
    {
        // use warexhaustion, stability, factories, wars, cities, population, development, and income
        let temp = (this._warExhaustion+this._factories+this._development)*this._stability;
        let a = 0.989, b = -5;
        this.__power = (10-Math.pow(a,temp+b))/(1+Math.pow(a,temp+b))+1;
        return this.__power();
    }

    /**
     * Completes all required steps to update the country
     * @return {float} war exhaustion
     */
    calcWarExhaustion()
    {
        // use experience, wars, ideology, population, and income
        // affect stability, and power
        let temp = this.getWars()/this.getExperience();
        if (this.getIdeology() == "nonaligned")
            temp*=0.9;
        if (this.getIdeology() == "communism")
            temp*=0.8;
        if (this.getIdeology() == "facism")
            temp*=0.2;
        if (this.getIdeology() == "democracy")
            temp*=0.8;
        
        this._warExhaustion = temp;
        return this._warExhaustion;
    }

    /**
     * Calculates the stability of a country on a scale of 0 to 1 where 1 is stable and 0 is unstable
     * @return {float} stability percentage reflected as a decimal between 0 and 1
     */
    calcStability()
    {
        // use income, population, landarea, cities, war exhaustion, and experience
        // affect power
        let temp = 0;
        if (this.getIdeology() == "nonaligned")
            temp = (Math.pow(this.getWars(), 2)/2)/this.getExperience()*this.getPopulation()/this.getCities();
        if (this.getIdeology() == "communism")
            temp = this.getWars()*0.75/this.getExperience()*this.getPopulation()/this.getCities();
        if (this.getIdeology() == "facism")
            temp = this.getExperience()*this.getPopulation()/this.getCities();
        if (this.getIdeology() == "democracy")
            temp = this.getWars()/this.getExperience()*this.getPopulation()/this.getCities();

        this._stability = temp/(Math.sqrt(Math.pow(temp, 2)+this._constant));
        return this._stability;
    }

    /**
     * Calculates development given treasury, population, cities, income, resources, and ideology
     * @return {float} development index between 0 and 1
     */
    calcDevelopment()
    {
        // use cities, population, income, treasury, ideology, and resources
        // affect power, income, and cities
        let gdpPpp = this.getTreasury()/this.getPopulation();
        let popPerCity = this.getPopulation()/this.getCities();
        let incomePerCity = this.getIncome()/this.getCities();
        let resourcesPerCity = this.getResources()/this.getCities();
        let temp = Math.pow((popPerCity*incomePerCity*1/this.getTreasury()), resourcesPerCity);
        
        if (this.getIdeology() == "nonaligned")
            temp *= 1;
        if (this.getIdeology() == "communism")
            temp *= Math.PI;
        if (this.getIdeology() == "facism")
            temp *= Math.PI/2;
        if (this.getIdeology() == "democracy")
            temp *= Math.PI;
        
        this._development = -(1-Math.pow(this._constant, temp))/(1+Math.pow(this._constant, temp));
        return this._development;
    }
    
    /**
     * Calculates the number of factories in a country given population, cities, income treasury, ideology, and resources
     * @return {int} the number of factories in the country
     */
    calcFactories()
    {
        // use cities, population, income, treasury,ideology, and resources
        // affect power, income, and cities
        let popPerCity = this.getPopulation()/this.getCities();
        let incomePerCity = this.getIncome()/this.getCities();
        let resourcesPerCity = this.getResources()/this.getCities();
        let temp = Math.pow((popPerCity*incomePerCity*1/this.getTreasury()), resourcesPerCity);

        if (this.getIdeology() == "nonaligned")
            temp *= 1;
        if (this.getIdeology() == "communism")
            temp *= Math.PI;
        if (this.getIdeology() == "facism")
            temp *= Math.PI/2;
        if (this.getIdeology() == "democracy")
            temp *= Math.PI;

        this._factories = int(temp*this.getCities());
        return this._factories;
    }

    /**
     * 
     * @param {int} experience 
     */
    setExperience(experience)
    {
        this.properties.experience = experience;
    }

    /**
     * 
     * @param {int} factor 
     * @param {string} key 
     */
    incrementPopulation(factor, key)
    {
        if (key=='A')
            this.setExperience(Math.floor(this.getExperience()+factor));
        else if (key=='B')
            this.setExperience(Math.floor(this.getExperience()*factor));
        else if (key=='C')
            this.setExperience(Math.pow(this.getExperience(), factor));
    }
    
    getExperience()
    {
        return this.properties.experience;
    }
/**
     * 
     * @param {string} name
     */
    setName(name)
    {
        this.properties.name = name;
    }
    
    getName()
    {
        return this.properties.name;
    }

    /**
     * 
     * @param {int} population
     */
    setPopulation(population)
    {
        this.properties.population = population;
    }

    /**
     * 
     * @param {int} factor 
     * @param {string} key 
     */
    incrementPopulation(factor, key)
    {
        if (key=='A')
            this.setPopulation(Math.floor(this.getPopulation()+factor));
        else if (key=='B')
            this.setPopulation(Math.floor(this.getPopulation()*factor));
        else if (key=='C')
            this.setPopulation(Math.pow(this.getPopulation(), factor));
    }
    
    getPopulation()
    {
        return this.properties.population;
    }

    /**
     * 
     * @param {float} treasury
     */
    setTreasury(treasury)
    {
        this.properties.treasury = treasury;
    }

    /**
     * 
     * @param {float} factor 
     * @param {string} key 
     */
    incrementTreasury(factor, key)
    {
        if (key=='A')
            this.setTreasury(this.getTreasury()+factor);
        else if (key=='B')
            this.setTreasury(this.getTreasury()*factor);
        else if (key=='C')
            this.setTreasury(Math.pow(this.getTreasury(), factor));
    }
    
    getTreasury()
    {
        return this.properties.treasury;
    }

    /**
     * 
     * @param {int} cities
     */
    setCities(cities)
    {
        this.properties.cities = cities;
    }

    /**
     * 
     * @param {int} factor 
     * @param {string} key 
     */
    incrementCities(factor, key)
    {
        if (key=='A')
            this.setCities(this.getCities()+factor);
        else if (key=='B')
            this.setCities(this.getCities()*factor);
        else if (key=='C')
            this.setCities(Math.pow(this.getCities(), factor));
    }
    
    getCities()
    {
        return this.properties.cities;
    }

    /**
     * 
     * @param {float} income
     */
    setIncome(income)
    {
        this.properties.income = income;
    }

    /**
     * 
     * @param {float} factor 
     * @param {string} key 
     */
    incrementIncome(factor, key)
    {
        if (key=='A')
            this.setIncome(this.getIncome()+factor);
        else if (key=='B')
            this.setIncome(this.getIncome()*factor);
        else if (key=='C')
            this.setIncome(Math.pow(this.getIncome(), factor));
    }
    
    getIncome()
    {
        return this.properties.income;
    }

    /**
     * 
     * @param {int} wars
     */
    setWars(wars)
    {
        this.properties.wars = wars;
    }

    /**
     * 
     * @param {int} factor 
     * @param {string} key 
     */
    incrementWars(factor, key)
    {
        if (key=='A')
            this.setWars(Math.floor(this.getWars()+factor));
        else if (key=='B')
            this.setWars(Math.floor(this.getWars()*factor));
        else if (key=='C')
            this.setWars(Math.pow(this.getWars(), factor));
    }
    
    getWars()
    {
        return this.properties.wars;
    }

    /**
     * 
     * @param {string} ideologyCode
     */
    setIdeology(ideologyCode)
    {
        switch(ideologyCode)
        {
            case 1: this.properties.ideology = "nonaligned"; break;
            case 2: this.properties.ideology = "communism"; break;
            case 3: this.properties.ideology = "facism"; break;
            case 4: this.properties.ideology = "democracy"; break;
        }
    }

    getIdeology()
    {
        return this.properties.ideology;
    }

    /**
     * 
     * @param {int} resources
     */
    setResources(resources)
    {
        this.properties.resources = resources;
    }

    getResources()
    {
        return this.properties.resources;
    }
}