import React from 'react';
import DropDown from '../layout/DropDown';

const SeatingArrangement = () => {
  return (
    <form>
      <div className='row py-3'>
        <div className='col-md-3'>
          <div className='card h-100 shadow'>
            <div class='card-body'>
              <DropDown
                title='Institute'
                options={['CSPIT', 'DEPSTAR', 'RPCC']}
              />
              <DropDown
                title='Degree'
                options={['B.tech(CE)', 'B.tech(CSE)', 'B.tech(IT)']}
              />
              <DropDown title='Academic Year' options={['2020-2021']} />
              <DropDown title='Semesters' options={['Even', 'Odd']} />
              <DropDown
                title='Semester No.'
                options={['1', '2', '3', '4', '5', '6', '7', '8']}
              />
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card h-100 shadow'>
            <div class='card-body'>
              <h3 className='text-center'>SEATING ARRANGEMENT</h3>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='card h-100 shadow'>
            <div class='card-body'>
              <a href='!#' class='btn btn-primary psbtn'>
                Submit
              </a>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SeatingArrangement;
