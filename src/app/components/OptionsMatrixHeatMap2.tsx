"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { Maybe } from "true-myth";

type OptionDate = {
  value: number;
  label: string;
};

type OptionsChainData = {
  [key: string]: {
    strike: number;
    contractSymbol: string;
    lastPrice: number;
    percentChange: number;
    inTheMoney: boolean;
    impliedVolatility: number; // Add this line
  };
};

type OptionsMatrix = [number[][], string[], number[]];

interface OptionChainCalculatorClassicCallsProps {
  isComponent: boolean;
}

type HeatmapCell = {
  value: number;
  profitLoss: number;
  stockPrice: number;
  date: string;
};

export default function OptionsMatrixHeapMapv2({
  isComponent,
}: OptionChainCalculatorClassicCallsProps) {
  const [tickerPrice, setTickerPrice] = useState<Maybe<number>>(
    Maybe.nothing()
  );
  const [optionsChainData, setOptionsChainData] = useState<
    Maybe<OptionsChainData>
  >(Maybe.nothing());
  const [selectedOptionPrice, setSelectedOptionPrice] = useState<string>("");
  const [optionDates, setOptionDates] = useState<Maybe<OptionDate[]>>(
    Maybe.nothing()
  );
  const [dateArrayIndex, setDateArrayIndex] = useState<string>("");
  const [optionsMatrix, setOptionsMatrix] = useState<Maybe<OptionsMatrix>>(
    Maybe.nothing()
  );
  const [ticker, setTicker] = useState<string>("");
  const [scrollableOptionPricesVisible, setScrollableOptionPricesVisible] =
    useState<boolean>(true);
  const [optionsMatrixLoading, setOptionsMatrixLoading] =
    useState<boolean>(false);
  const [datesLoading, setDatesLoading] = useState<boolean>(false);
  const [tickerPriceLoading, setTickerPriceLoading] = useState<boolean>(false);
  const [strikePriceTableLoading, setStrikePriceTableLoading] =
    useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<Maybe<HeatmapCell>>(Maybe.nothing());
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convertToCSV = (data: OptionsMatrix): string => {
    const headers = [...data[1], "Possible Stock Prices"];
    const rows = data[0].map((row, index) => [...row, data[2][index]]);
    const csvString = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");
    return csvString;
  };

  const downloadCSV = () => {
    optionsMatrix.match({
      Just: (matrix) => {
        const csvString = convertToCSV(matrix);
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      Nothing: () => {},
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(event.target.value.toUpperCase());
  };

  const handleTickerSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!ticker) return;

    setTickerPriceLoading(true);
    setDatesLoading(true);

    try {
      // const priceResult = await fetch(`https://twelve-data1.p.rapidapi.com/price?symbol=${ticker}&format=json&outputsize=30`, {
      //   method: 'GET',
      //   headers: {
      //     'X-RapidAPI-Key': '445c39de8amsh8bd26cd960e448ep162acfjsn89f10e51b377',
      //     'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      //   }
      // })
      // const priceResult = 140
      // const priceData = {
      //   price: 140.0,
      // };
      setTickerPrice(Maybe.of(140.0));

      const datesResult = await fetch(
        `https://buildingalpha-backend-74a6217c48ee.herokuapp.com/getOptionChainDates?ticker=${ticker}`
      );
      const datesData = await datesResult.json();
      const dateObject = datesData.dates.map((date: string, index: number) => ({
        value: index,
        label: date,
      }));
      setOptionDates(Maybe.of(dateObject));
    } catch (error) {
      console.error(error);
    } finally {
      setTickerPriceLoading(false);
      setDatesLoading(false);
    }
  };

  const handleCellClick = async (
    price: number,
    strike: number,
    volatility: number,
    symbol: string
  ) => {
    setSelectedOptionPrice(price.toString());
    setScrollableOptionPricesVisible(false);
    setOptionsMatrixLoading(true);

    try {
      const response = await fetch(
        `https://buildingalpha-backend-74a6217c48ee.herokuapp.com/getOptionsPriceMatrix?price=${price}&symbol=${symbol}&strike=${strike}&volatility=${volatility}&stockPrice=${tickerPrice.unwrapOr(
          0
        )}&type=call`
      );
      const data = await response.json();
      setOptionsMatrix(Maybe.of(data));
    } catch (error) {
      console.error(error);
    } finally {
      setOptionsMatrixLoading(false);
    }
  };

  const handleDateClick = (value: string) => {
    setScrollableOptionPricesVisible(true);
    setDateArrayIndex(value);
  };

  useEffect(() => {
    if (dateArrayIndex && ticker) {
      const fetchData = async () => {
        setStrikePriceTableLoading(true);
        try {
          const response = await fetch(
            `https://buildingalpha-backend-74a6217c48ee.herokuapp.com/getOptionsChainData?ticker=${ticker}&index=${dateArrayIndex}&type=call`
          );
          const data = await response.json();
          setOptionsChainData(Maybe.of(data));
        } catch (error) {
          console.error(error);
        } finally {
          setStrikePriceTableLoading(false);
        }
      };
      fetchData();
    }
  }, [dateArrayIndex, ticker]);

  const getCellClassName = (cell: number): string => {
    const ratio = cell / parseFloat(selectedOptionPrice);
    if (ratio === 0) return "bg-red-900";
    if (ratio > 0 && ratio < 0.5) return "bg-red-700";
    if (ratio >= 0.5 && ratio < 1) return "bg-red-500";
    if (ratio >= 1 && ratio < 1.25) return "bg-green-500";
    if (ratio >= 1.25) return "bg-green-700";
    return "";
  };

  const renderTableHeaders = () => {
    return optionsMatrix.match({
      Just: (matrix) => (
        <TableRow>
          {matrix[1].map((date, index) => (
            <TableHead key={index}>{date[0]}</TableHead>
          ))}
          <TableHead>Possible Stock Prices</TableHead>
        </TableRow>
      ),
      Nothing: () => null,
    });
  };

  const renderTableRows = () => {
    return optionsMatrix.match({
      Just: (matrix) =>
        matrix[0].map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <TableCell
                key={columnIndex}
                className={getCellClassName(cell)}
                onClick={() => setShowAnalysis(true)}
              >
                ${cell}
                <Button
                  variant="ghost"
                  className="price-cell-button"
                  onClick={() => showPriceAnalysis(cell)}
                >
                  <p className="m-0 text-xs">
                    Profit/Loss: $
                    {roundToHundredth(
                      (cell - parseFloat(selectedOptionPrice)) * 100
                    )}
                    /option
                  </p>
                </Button>
              </TableCell>
            ))}
            <TableCell>${matrix[2][rowIndex]}</TableCell>
          </TableRow>
        )),
      Nothing: () => null,
    });
  };

  const roundToHundredth = (number: number): number => {
    return Math.round(number * 100) / 100;
  };

  const showPriceAnalysis = (price: number) => {
    // Implement price analysis logic here
    return null;
  };

  const drawHeatmap = () => {
    optionsMatrix.match({
      Just: (matrix) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellWidth = 50;
        const cellHeight = 20;
        const leftPadding = 80;
        const topPadding = 30;
        const bottomPadding = 80;

        canvas.width = matrix[1].length * cellWidth + leftPadding;
        canvas.height = matrix[0].length * cellHeight + topPadding + bottomPadding;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw x-axis labels (dates)
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = '10px Arial';

        const skipFactor = Math.ceil(matrix[1].length / 10); // Show about 10 labels on x-axis
        matrix[1].forEach((date, i) => {
          if (i % skipFactor === 0) {
            ctx.save();
            ctx.translate(leftPadding + i * cellWidth + cellWidth / 2, canvas.height - bottomPadding + 10);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(date[0], 0, 0);
            ctx.restore();
          }
        });

        // Draw y-axis labels (stock prices)
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const priceSkipFactor = Math.ceil(matrix[2].length / 20); // Show about 20 labels on y-axis
        matrix[2].forEach((price, i) => {
          if (i % priceSkipFactor === 0) {
            ctx.fillText(`$${price}`, leftPadding - 5, topPadding + i * cellHeight + cellHeight / 2);
          }
        });

        // Draw heatmap cells
        matrix[0].forEach((row, y) => {
          row.forEach((value, x) => {
            const ratio = value / parseFloat(selectedOptionPrice);
            ctx.fillStyle = getCellColor(ratio);
            ctx.fillRect(leftPadding + x * cellWidth, topPadding + y * cellHeight, cellWidth, cellHeight);
            
            // Draw cell border
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.strokeRect(leftPadding + x * cellWidth, topPadding + y * cellHeight, cellWidth, cellHeight);

            // Highlight hovered cell
            if (hoverCell && hoverCell.row === y && hoverCell.col === x) {
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
              ctx.lineWidth = 2;
              ctx.strokeRect(leftPadding + x * cellWidth, topPadding + y * cellHeight, cellWidth, cellHeight);
              ctx.lineWidth = 1;
            }
          });
        });
      },
      Nothing: () => {},
    });
  };

  const getCellColor = (ratio: number): string => {
    if (ratio === 0) return 'rgb(153, 0, 0)';
    if (ratio > 0 && ratio < 0.5) return 'rgb(204, 0, 0)';
    if (ratio >= 0.5 && ratio < 1) return 'rgb(255, 0, 0)';
    if (ratio >= 1 && ratio < 1.25) return 'rgb(0, 204, 0)';
    if (ratio >= 1.25) return 'rgb(0, 153, 0)';
    return 'rgb(255, 255, 255)';
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    optionsMatrix.match({
      Just: (matrix) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - 80; // Update leftPadding here
        const y = event.clientY - rect.top - 30; // Update topPadding here

        const cellWidth = 50;
        const cellHeight = 20;

        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);

        if (col >= 0 && col < matrix[1].length && row >= 0 && row < matrix[0].length) {
          const cell: HeatmapCell = {
            value: matrix[0][row][col],
            profitLoss: (matrix[0][row][col] - parseFloat(selectedOptionPrice)) * 100,
            stockPrice: matrix[2][row],
            date: matrix[1][col][0],
          };
          setSelectedCell(Maybe.of(cell));
        }
      },
      Nothing: () => {},
    });
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    optionsMatrix.match({
      Just: (matrix) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - 80; // leftPadding
        const y = event.clientY - rect.top - 30; // topPadding

        const cellWidth = 50;
        const cellHeight = 20;

        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);

        if (col >= 0 && col < matrix[1].length && row >= 0 && row < matrix[0].length) {
          setHoverCell({ row, col });
        } else {
          setHoverCell(null);
        }
      },
      Nothing: () => {},
    });
  };

  useEffect(() => {
    drawHeatmap();
  }, [optionsMatrix, selectedOptionPrice, hoverCell]);

  return (
    <Card className="classic-calls-wrap">
      <CardHeader>
        <CardTitle>Long Call Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTickerSubmit} className="flex items-center mb-4">
          <label className="mr-2">
            Select Ticker:
            <Input
              type="text"
              value={ticker}
              onChange={handleChange}
              className="ml-2"
            />
          </label>
          <Button type="submit" variant="outline">
            <img src="/buttonarrow.png" alt="Submit" className="w-4 h-4" />
          </Button>
          <span className="ml-2">(ex: TSLA)</span>
        </form>

        {tickerPrice.match({
          Just: (price) => <p>Ticker Price: ${roundToHundredth(price)}</p>,
          Nothing: () => null,
        })}

        {datesLoading && (
          <div className="my-2">Expiration Dates Loading....</div>
        )}

        {optionDates.match({
          Just: (dates) => (
            <>
              <p>Choose the Expiration Date: </p>
              <Select onValueChange={handleDateClick}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((date) => (
                    <SelectItem key={date.value} value={date.value.toString()}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ),
          Nothing: () => null,
        })}

        {strikePriceTableLoading && (
          <div>Loading the strike price table...</div>
        )}

        {optionsChainData.match({
          Just: (data) =>
            scrollableOptionPricesVisible && (
              <div className="scrollable-option-prices-table mt-4">
                <p>
                  Click on one of these options to get the options matrix.
                  Options Matrix will allow you to accurately predict the option
                  price given the stock price. This website cannot predict that
                  for you. Invest only according to your own risk tolerance,
                  please. Do not gamble.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Index</TableHead>
                      <TableHead>Strike</TableHead>
                      <TableHead>Contract Symbol</TableHead>
                      <TableHead>Last Price</TableHead>
                      <TableHead>Change %</TableHead>
                      <TableHead>In The Money?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(data).map(([row, columns]) => (
                      <TableRow
                        key={row}
                        className="strike-price-row"
                        onClick={() =>
                          handleCellClick(
                            columns.lastPrice,
                            columns.strike,
                            columns.impliedVolatility,
                            columns.contractSymbol
                          )
                        }
                      >
                        <TableCell>{row}</TableCell>
                        <TableCell>${columns.strike}</TableCell>
                        <TableCell>{columns.contractSymbol}</TableCell>
                        <TableCell>${columns.lastPrice}</TableCell>
                        <TableCell>
                          {roundToHundredth(columns.percentChange)}%
                        </TableCell>
                        <TableCell
                          className={
                            columns.inTheMoney
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {columns.inTheMoney.toString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  onClick={() =>
                    setScrollableOptionPricesVisible(
                      !scrollableOptionPricesVisible
                    )
                  }
                >
                  {scrollableOptionPricesVisible
                    ? "Hide the options"
                    : "Show the options"}
                </Button>
              </div>
            ),
          Nothing: () => null,
        })}

        {selectedOptionPrice && (
          <Card className="calculation-results mt-4">
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Selected Option Price: ${selectedOptionPrice} * 100 = $
                {Math.round(parseFloat(selectedOptionPrice) * 100)}
              </p>
              {showAnalysis && <div>meow</div>}
              {showPriceAnalysis(parseFloat(selectedOptionPrice))}
            </CardContent>
          </Card>
        )}

        {optionsMatrixLoading ? (
          <div>Loading the CSV with the options matrix...</div>
        ) : (
          optionsMatrix.match({
            Just: () => (
              <div className="flex mt-4">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseLeave={() => setHoverCell(null)}
                  style={{ cursor: 'pointer' }}
                />
                {selectedCell.match({
                  Just: (cell) => (
                    <div className="ml-4">
                      <h3>Selected Cell Info:</h3>
                      <p>Date: {cell.date}</p>
                      <p>Stock Price: ${cell.stockPrice}</p>
                      <p>Option Value: ${cell.value}</p>
                      <p>Profit/Loss: ${roundToHundredth(cell.profitLoss)}/option</p>
                    </div>
                  ),
                  Nothing: () => null,
                })}
              </div>
            ),
            Nothing: () => null,
          })
        )}
      </CardContent>
    </Card>
  );
}
