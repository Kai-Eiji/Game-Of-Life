import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ButtonToolbar, Button, DropdownItem, DropdownButton} from 'react-bootstrap';

class Box extends Component{
    selectBox = () =>{
        this.props.selectBox(this.props.row, this.props.col);
    }

    render(){
        return(
            <div className={this.props.boxClass} id={this.props.id} onClick={this.selectBox} />

        )
    }
}

class Grid extends Component{
    render(){
        let width = this.props.cols *14;
        if(this.props.superBig)
        {
            width = this.props.cols *10;
        }
        let rowsArray = [];
        let boxClass = '';
        console.log(this.props);

        for(let i = 0; i < this.props.rows; i++){
            for(let j = 0; j < this.props.cols; j++){
                let boxId = i + '_' + j;
                if(!this.props.superBig)
                {
                    boxClass = this.props.gridFull[i][j] ? 'box on' : 'box off';
                }
                else
                {
                    boxClass = this.props.gridFull[i][j] ? 'mini-box on' : 'mini-box off';
                }
                

                rowsArray.push(
                    <Box
                        boxClass={boxClass}
                        key={boxId}
                        boxId={boxId}
                        col={j}
                        row={i}
                        selectBox={this.props.selectBox}
                        superBig={this.props.superBig}/>
                )
            }
        }
        return(
            <div className='grid' style={{width: width}}>
                {rowsArray}
            </div>
        )
    }
}

class Buttons extends Component{

    handleSelect = (evt) =>{
        this.props.gridSize(evt);
    }

    render(){
        return(
            <div className="center">
                <ButtonToolbar>
                    <Button className='btn btn-default m-2' onClick={this.props.playButton}>
                        play
                    </Button>

                    <Button className="btn btn-default m-2" onClick={this.props.pauseButton}>
					  Pause
					</Button>

					<Button className="btn btn-default m-2" onClick={this.props.clear}>
					  Clear
					</Button>

					<Button className="btn btn-default m-2" onClick={this.props.slow}>
					  Slow
					</Button>

					<Button className="btn btn-default m-2" onClick={this.props.fast}>
					  Fast
					</Button>

					<Button className="btn btn-default m-2" onClick={this.props.seed}>
					  Seed
					</Button>

                    <DropdownButton className='m-2' title='Grid Size' id='size-menu' onSelect={this.handleSelect}>
                        <DropdownItem eventKey='1'>20x20</DropdownItem>
                        <DropdownItem eventKey='2'>50x30</DropdownItem>
                        <DropdownItem eventKey='3'>70x50</DropdownItem>
                        <DropdownItem eventKey='4'>100x100</DropdownItem>
                    </DropdownButton>

                    <Button className="btn btn-default m-2">
                        <a className="white" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">More About The Game</a>
					</Button>
                    

                </ButtonToolbar>
            </div>
        )
    }
}

class Main extends Component{
    constructor(){
        super();
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;
        this.superBig = false;
        this.state ={
            generation: 0,
            gridFull : Array(this.rows).fill().map( ()=> Array(this.cols).fill(false))
        }
    }

    selectBox = (row, col) =>{
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        })

    }

    seed = () =>{
        let gridCopy = arrayClone(this.state.gridFull);

        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                if(Math.floor(Math.random() * 4) === 1){ //giving 1/4 of chances to make it ture
                    gridCopy[i][j] = true;
                }
            }
        }

        this.setState({
            gridFull: gridCopy
        })
    }

    playButton = () =>{
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.speed);
    }

    pauseButton = () =>{
        clearInterval(this.intervalId);
    }

    slow = () =>{
        this.speed = 1000;
        this.playButton();
    }

    fast = () =>{
        this.speed = 100;
        this.playButton();
    }

    clear = () =>{
        let grid = Array(this.rows).fill().map( ()=> Array(this.cols).fill(false));
        this.setState({gridFull: grid, generation: 0})
    }

    gridSize = (size) => {
        switch(size){
            case '1':
                this.cols = 20;
                this.rows = 10;
                this.superBig = false;
            break;

            case '2':
                this.cols = 50;
                this.rows = 30;
                this.superBig = false;
            break;

            case '3':
                this.cols = 70;
                this.rows = 50;
                this.superBig = false;
            break;

            case '4':
                this.cols = 100;
                this.rows = 200;
                this.superBig = true;
           
        }

        this.clear();
    }

    play = () => {
        
        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
              let count = 0;
              if (i > 0) if (g[i - 1][j]) count++;
              if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
              if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
              if (j < this.cols - 1) if (g[i][j + 1]) count++;
              if (j > 0) if (g[i][j - 1]) count++;
              if (i < this.rows - 1) if (g[i + 1][j]) count++;
              if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
              if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
              if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
              if (!g[i][j] && count === 3) g2[i][j] = true;
            }
          }
          this.setState({
            gridFull: g2,
            generation: this.state.generation + 1
          });
  
    }

    componentDidMount(){
        this.seed();
        //this.playButton();
    }

    render(){
        
        return(
            <div>
                <h1 className="green">Conway's Game of Life</h1>
                <Buttons
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    slow={this.slow}
                    clear={this.clear}
                    fast={this.fast}
                    gridSize={this.gridSize}
                    seed={this.seed}
                />
                <Grid 
                    gridFull={this.state.gridFull}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                    superBig={this.superBig}/>
                <h2>Generations: {this.state.generation}</h2>
            </div>
        )
    }
}

function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr))
}


ReactDOM.render(<Main />, document.getElementById('root'));


