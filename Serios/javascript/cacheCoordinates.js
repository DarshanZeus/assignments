export default class cacheCoordinates{

    constructor(){
        this.startcordinateX = -1;
        this.startcordinateY = -1;
        this.endcordinateX = -2;
        this.endcordinateY = -2;
    }
    
    
    getTopHeight(){
        return this.TopHeight;
    }

    getLeftWidth(){
        return this.LeftWidth;
    }

    getHeight(){
        return this.Height;
    }

    getWidth(){
        return this.Width;
    }
     
    getAll(){
        return [
            this.startcordinateX,
            this.startcordinateY,
            this.endcordinateX,
            this.endcordinateY
        ];
    }

    setStartcordinateX(startcordinateX){
        this.startcordinateX = startcordinateX;
    } 

    setStartcordinateY(startcordinateY){
        this.startcordinateY = startcordinateY;
    }

    setEndcordinateX(endcordinateX){
        this.endcordinateX = endcordinateX;
    }

    setEndcordinateY(endcordinateY){
        this.endcordinateY = endcordinateY;
    }

    setAll(
        startcordinateX = 0, 
        startcordinateY = 0,
        endcordinateX = 0,
        endcordinateY = 0
    ){
        this.startcordinateX = startcordinateX;
        this.startcordinateY = startcordinateY;
        this.endcordinateX = endcordinateX;
        this.endcordinateY = endcordinateY;
    }

    calculateTopHeight(){
        this.TopHeight = 0;
    }

    calculateLeftWidth(){
        this.LeftWidth = 0;
    }

    calculateHeight(){
        this.Height = 0;
    }

    calculateWidth(){
        this.Width = 0;
    }
    
    calculateAll(){
        this.calculateTopHeight();
        this.calculateLeftWidth();
        this.calculateHeight();
        this.calculateWidth();
    }

};