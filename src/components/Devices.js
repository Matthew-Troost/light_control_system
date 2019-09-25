import React from 'react';
import {
  ArcSlider,
  Box,
  Checkbox,
  Flex,
  Table,
  Txt,
  Heading,
  Input,
} from 'rendition';
import styled from 'styled-components';

const ControlContainer = styled(Box)`
  border-top-left-radius: 10px;
`;

export class Devices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDeviceId: -1,
    };
  }

  componentDidMount() {
    this.getDevices();
  }

  getDevices() {
    fetch('http://localhost:3000/api/v1/device')
      .then(response => response.json())
      .then(response => {
        this.setState({ devices: response.data });
      })
      .catch(error => console.error(error));
  }

  getSelectedRow = selectedRows => {
    if (selectedRows.length === 0) {
      return this.setState({
        selectedDeviceId: -1,
      });
    }

    if (selectedRows.length > 1) {
      selectedRows.shift();
    }

    var index = this.state.devices.indexOf(
      this.state.devices.find(device => device.id === selectedRows[0].id),
    );

    this.setState({
      selectedDeviceId: index,
    });
  };

  updateBrightness = brightness => {
    if (this.state.selectedDeviceId > -1) {
      const updatedDevices = this.state.devices;
      updatedDevices[this.state.selectedDeviceId].brightness = brightness * 100;
      this.setState({ devices: updatedDevices });
    }
  };

  changeName = name => {
    const updatedDevices = this.state.devices;
    updatedDevices[this.state.selectedDeviceId].name = name;
    this.setState({ devices: updatedDevices });
  };

  toggleSwitch = active => {
    console.log(active);
    // const selectedDevice = this.state.selectedDevice;
    // selectedDevice.active = active;
    // this.setState({ selectedDevice });
  };

  render() {
    const columns = [
      {
        field: 'name',
        label: 'Room',
        sortable: true,
      },
      {
        field: 'active',
        label: 'State',
        render(value) {
          return (
            <Flex>
              <Checkbox toggle onChange={this.toggleSwitch} mr={2} />
              <Txt ml={2}>{value ? 'On' : 'Off'}</Txt>
            </Flex>
          );
        },
      },
      {
        field: 'brightness',
        label: 'Brightness',
        render(value) {
          return `${Math.round(value)}%`;
        },
      },
    ];

    return (
      <Flex flex='1' mt={4}>
        <Box flex='3'>
          <Table
            flex='1'
            columns={columns}
            data={this.state.devices}
            rowKey='id'
            onCheck={this.getSelectedRow}
          />
          <Input
            mb={3}
            value={
              this.state.selectedDeviceId > -1
                ? this.state.devices[this.state.selectedDeviceId].name
                : ''
            }
            onChange={event => this.changeName(event.target.value)}
          />
        </Box>

        <ControlContainer flex='2' ml={3} bg='secondary.main'>
          <ArcSlider
            width='450px'
            mx='auto'
            value={
              this.state.selectedDeviceId > -1
                ? this.state.devices[this.state.selectedDeviceId].brightness /
                  100
                : 0
            }
            onValueChange={this.updateBrightness}
            fillColor={
              this.state.selectedDeviceId > -1
                ? this.state.devices[this.state.selectedDeviceId].active
                  ? ''
                  : '#B8B8B8'
                : '#B8B8B8'
            }
          >
            <Heading.h2 color='white'>
              {this.state.selectedDeviceId > -1
                ? Math.round(
                    this.state.devices[this.state.selectedDeviceId].brightness,
                  )
                : 0}
              %
            </Heading.h2>
            <Txt color='white'>Brightness</Txt>
          </ArcSlider>
        </ControlContainer>
      </Flex>
    );
  }
}
