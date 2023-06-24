import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Card,
  Row,
  Col
} from "antd";
import {compareProducts} from "./Services/User.service.js";

const RegisterForm = () => {
    const { Meta } = Card;
    const [form] = Form.useForm();
    const [apiData, setApiData ] = useState()
    const [firstArr, setFirstArr ] = useState()
    const [secondArr, setSecondArr ] = useState()
    const [isCompare, setIsCompare ] = useState(false)
    const [selectedValues, setSelectedValues] = useState([]);


    const API_BASE = "http://localhost:8080";
    
    const onFinish = async (values) => {
      // console.log("Received values of form: ", values);
      if( values.product && values.company.length > 0 ) {
          const result = await compareProducts(values)

          if(result?.response.length > 0) {
            setApiData(result.response)
            setIsCompare(true)
            // ************************* First Product ********* 
            const combinedImages = {};
            result.response["0"].forEach((image) => {
              const color = image.imgsAlt.split("-")[1]; 
      
              if (combinedImages[color]) {
                combinedImages[color].push(image); 
              } else {
                combinedImages[color] = [image];
              }
            });

            // console.log("Arr 1",combinedImages);
            setFirstArr(combinedImages)

            // ************************ Second Product **********
            const combinedImages2 = {};
            result.response["1"].forEach((item) => {
              const color = item.item.split(" ")[0];
              if (combinedImages2[color]) {
                combinedImages2[color].push(item);
              } else {
                combinedImages2[color] = [item];
              }
            });
            
            // console.log("Arr 2",combinedImages2);
            setSecondArr(combinedImages2)
          }
        }
      };
      
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const handleCheckboxChange = (selected) => {
      setSelectedValues(selected);
    };

    return (
        <>
          <div>
          <h2 style={{textAlign:'center'}}>Alberto Shoe Hub</h2>
        </div>
        { !isCompare && <div style={{}}>
        <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >

        <Form.Item
            name="product"
            label="Enter Product Name : "
            rules={[
                {
                required: true,
                message: "Please input your product name!",
                whitespace: true,
                },
                {
                  message: "Please input your valid product name!",
                  pattern: /^[A-Za-z]+$/
                }
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item label="Select Company Name : " name="company">
            <Checkbox.Group value={selectedValues} onChange={handleCheckboxChange}>
              <Checkbox value="albertotorresi"> Alberto Torresi </Checkbox>
              <Checkbox value="redchief">redchief</Checkbox>
              <Checkbox value="other">Other</Checkbox>
            </Checkbox.Group>
        </Form.Item>
  
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
  
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Compare Now
          </Button>
        </Form.Item>

        </Form>
        </div> }
        { isCompare && <Row>
          <Col span={12}>
          <h3>Alberto Torresi</h3>
          {Object.keys(firstArr).map((color) => (
        <Col span={12} key={color}>
          <h2>{color}</h2>
          {firstArr[color].map((item, index) => (
            <Row>
              <Card
                hoverable
                style={{ width: 200}}
                cover={<img src={item.imgsUrl} alt={item.imgsAlt} />}
              >
                <Meta title={item.name} description={<span>
                  <p>Discounted Price: {item.discountedPrice}</p> 
                  <p>Original Price: {item.originalPrice}</p>
                </span>} />
              </Card>
            </Row>
          ))}
        </Col>
      ))}
          </Col>

          <Col span={12}>
            <h3>Red Chief</h3>
          {Object.keys(secondArr).map((color) => (
        <Col span={12} key={color}>
          <h2>{color}</h2>
          {secondArr[color].map((item, index) => (
            <Row>
              <Card
                hoverable
                style={{ width: 200}}
                cover={<img src={item.imaUrl} alt={item.imaUrl} />}
              >
                <Meta title={item.item} description={<span>
                  <p>Discounted Price: {item.discountPrice}</p> 
                  <p>Original Price: {item.originalPrice}</p>
                </span>} />
              </Card>
            </Row>
          ))}
        </Col>
      ))}
          </Col>
        </Row>}
        </>
    );
}

export default RegisterForm;