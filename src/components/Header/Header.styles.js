import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0 40px 0;

  div {
    background-color: #333;
    color: white;
    flex-basis: 20%;
    border-radius: 2rem;
    padding: 0.10rem 0.25rem;
    align-items: center;
    display: flex;
    justify-content: center;
    
    p {
      font-weight: bold;
    }

    label {
      margin-right: 5px;
      font-weight: bold;
    }

    .input {
      cursor: pointer;
    }
    
    .header-click {
      cursor: pointer;
    }
    
  }
  
	.greyed {
		color: grey;
		cursor: default
	}
  
`