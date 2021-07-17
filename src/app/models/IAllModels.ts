export interface IData {
    allAdds?: IAdds;
    cities?: Array<any>;
    filters?: Array<any>;
    towns?: Array<any>;
    user?: IUser;
    location?: ILocation;
    loading?: boolean;
    screenShots?: Array<any>;
    activeFilter: any;
}


export interface IMapF {
    type: any;
    payload: any;
}

export interface ILocation {
    addsLocations?: Array<any>,
    mainTown?: any,
    radius?: any
}


export interface ICity {
    name?: string;
    region?: string;
}

export interface IFilter {
    type?: string;
}

export interface IUser {
    authData?: any,
    coins?: any,
    ip?: any,
    id?: any
}

export interface IUserData {
    name?: string,
    lastname?: string,
    email?: string,
    phone?: string,
    country?: string,
    city?: string,
    password?: string
}

export interface IAdds {
    tempAdds?: Array<any>,
    allAds?: Array<any>,
    numberOfAdds?: any,
    yearData?: boolean,
    acitiveAdds?: Array<any>
}
