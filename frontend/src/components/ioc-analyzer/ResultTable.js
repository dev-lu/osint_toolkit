import React from 'react';

import Cve from './Cve';
import Domain from './Domain';
import Email from './Email';
import Hash from './Hash';
import Ipv4 from './Ipv4';
import Ipv6 from './Ipv6';
import Url from './Url';


function ResultTable(props) {
  if (props.iocType === 'IPv4') {
    return (
      <>
        <Ipv4 ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'IPv6') {
    return (
      <>
        <Ipv6 ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'MD5') {
    return (
      <>
        <Hash ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'SHA1') {
    return (
      <>
        <Hash ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'SHA256') {
    return (
      <>
        <Hash ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'Domain') {
    return (
      <>
        <Domain ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'URL') {
    return (
      <>
        <Url ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'Email') {
    return (
      <>
        <Email ioc={props.ioc} />
      </>
    )
  } else if (props.iocType === 'CVE') {
    return (
      <>
        <Cve ioc={props.ioc} />
      </>
    )
  }
}

export default ResultTable