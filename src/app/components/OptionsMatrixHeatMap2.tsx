"use client"

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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { Maybe } from "true-myth";

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
  const [selectedCell, setSelectedCell] = useState<Maybe<HeatmapCell>>(
    Maybe.nothing()
  );
  const [hoverCell, setHoverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState<'stock' | 'date' | 'options' | 'analysis'>('stock');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Add these new state variables to track completion of each step
  const [stockStepCompleted, setStockStepCompleted] = useState(false);
  const [dateStepCompleted, setDateStepCompleted] = useState(false);
  const [optionsStepCompleted, setOptionsStepCompleted] = useState(false);

  // Modify the nextStep function to update completion states
  const nextStep = () => {
    if (currentStep === 'stock') {
      setStockStepCompleted(true);
      setCurrentStep('date');
    } else if (currentStep === 'date') {
      setDateStepCompleted(true);
      setCurrentStep('options');
    } else if (currentStep === 'options') {
      setOptionsStepCompleted(true);
      setCurrentStep('analysis');
    }
  };

  const prevStep = () => {
    if (currentStep === 'analysis') setCurrentStep('options');
    else if (currentStep === 'options') setCurrentStep('date');
    else if (currentStep === 'date') setCurrentStep('stock');
  };

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

    setStockStepCompleted(true);
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

    setOptionsStepCompleted(true);
  };

  const handleDateClick = (value: string) => {
    setScrollableOptionPricesVisible(true);
    setDateArrayIndex(value);
    setDateStepCompleted(true);
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
                    {roundToHundredthAndAddSign(
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

  const roundToHundredthAndAddSign = (number: number): string => {
    const roundedNumber = Math.round(number * 100) / 100;
    if (roundedNumber > 0) {
      return `+$${roundedNumber}`;
    } else {
      return `-$${Math.abs(roundedNumber)}`;
    }
  };

  const roundToHundredth = (number: number): number => {
    const roundedNumber = Math.round(number * 100) / 100;
    return roundedNumber
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

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const containerWidth = canvas.parentElement?.clientWidth || 600;
        const containerHeight = canvas.parentElement?.clientHeight || 400;

        canvas.width = containerWidth;
        canvas.height = containerHeight;

        const leftPadding = 60;
        const topPadding = 20;
        const rightPadding = 20;
        const bottomPadding = 60;

        const availableWidth = containerWidth - leftPadding - rightPadding;
        const availableHeight = containerHeight - topPadding - bottomPadding;

        const cellWidth = availableWidth / matrix[1].length;
        const cellHeight = availableHeight / matrix[0].length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw x-axis labels (dates)
        ctx.fillStyle = "black";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.font = "10px Arial";

        const skipFactor = Math.ceil(matrix[1].length / 10);
        matrix[1].forEach((date, i) => {
          if (i % skipFactor === 0) {
            ctx.save();
            ctx.translate(
              leftPadding + i * cellWidth + cellWidth / 2,
              canvas.height - bottomPadding + 10
            );
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(date[0], 0, 0);
            ctx.restore();
          }
        });

        // Draw y-axis labels (stock prices)
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const priceSkipFactor = Math.ceil(matrix[2].length / 20);
        matrix[2].forEach((price, i) => {
          if (i % priceSkipFactor === 0) {
            ctx.fillText(
              `$${price}`,
              leftPadding - 5,
              topPadding + i * cellHeight + cellHeight / 2
            );
          }
        });

        // Draw heatmap cells
        matrix[0].forEach((row, y) => {
          row.forEach((value, x) => {
            const ratio = value / parseFloat(selectedOptionPrice);
            ctx.fillStyle = getCellColor(ratio);
            ctx.fillRect(
              leftPadding + x * cellWidth,
              topPadding + y * cellHeight,
              cellWidth,
              cellHeight
            );

            // Draw cell border
            ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
            ctx.strokeRect(
              leftPadding + x * cellWidth,
              topPadding + y * cellHeight,
              cellWidth,
              cellHeight
            );

            // Highlight hovered cell
            if (hoverCell && hoverCell.row === y && hoverCell.col === x) {
              ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
              ctx.lineWidth = 2;
              ctx.strokeRect(
                leftPadding + x * cellWidth,
                topPadding + y * cellHeight,
                cellWidth,
                cellHeight
              );
              ctx.lineWidth = 1;
            }
          });
        });
      },
      Nothing: () => {},
    });
  };

  const getCellColor = (ratio: number): string => {
    if (ratio === 0) return "rgb(153, 0, 0)";
    if (ratio > 0 && ratio < 0.5) return "rgb(204, 0, 0)";
    if (ratio >= 0.5 && ratio < 1) return "rgb(255, 0, 0)";
    if (ratio >= 1 && ratio < 1.25) return "rgb(0, 204, 0)";
    if (ratio >= 1.25) return "rgb(0, 153, 0)";
    return "rgb(255, 255, 255)";
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    optionsMatrix.match({
      Just: (matrix) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const leftPadding = 60;
        const topPadding = 20;
        const rightPadding = 20;
        const bottomPadding = 60;

        const availableWidth = canvas.width - leftPadding - rightPadding;
        const availableHeight = canvas.height - topPadding - bottomPadding;

        const cellWidth = availableWidth / matrix[1].length;
        const cellHeight = availableHeight / matrix[0].length;

        const col = Math.floor((x - leftPadding) / cellWidth);
        const row = Math.floor((y - topPadding) / cellHeight);

        if (
          col >= 0 &&
          col < matrix[1].length &&
          row >= 0 &&
          row < matrix[0].length
        ) {
          const cell: HeatmapCell = {
            value: matrix[0][row][col],
            profitLoss:
              (matrix[0][row][col] - parseFloat(selectedOptionPrice)) * 100,
            stockPrice: matrix[2][row],
            date: matrix[1][col][0],
          };
          setSelectedCell(Maybe.of(cell));
        }
      },
      Nothing: () => {},
    });
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    optionsMatrix.match({
      Just: (matrix) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const leftPadding = 60;
        const topPadding = 20;
        const rightPadding = 20;
        const bottomPadding = 60;

        const availableWidth = canvas.width - leftPadding - rightPadding;
        const availableHeight = canvas.height - topPadding - bottomPadding;

        const cellWidth = availableWidth / matrix[1].length;
        const cellHeight = availableHeight / matrix[0].length;

        const col = Math.floor((x - leftPadding) / cellWidth);
        const row = Math.floor((y - topPadding) / cellHeight);

        if (
          col >= 0 &&
          col < matrix[1].length &&
          row >= 0 &&
          row < matrix[0].length
        ) {
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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Long Call Strategy Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentStep} onValueChange={(value) => {
          // Only allow changing to a tab if previous steps are completed
          if (
            (value === 'date' && stockStepCompleted) ||
            (value === 'options' && dateStepCompleted) ||
            (value === 'analysis' && optionsStepCompleted) ||
            value === 'stock'
          ) {
            setCurrentStep(value as typeof currentStep);
          }
        }}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stock">Select Stock</TabsTrigger>
            <TabsTrigger value="date" disabled={!stockStepCompleted}>Expiration Date</TabsTrigger>
            <TabsTrigger value="options" disabled={!dateStepCompleted}>Options Chain</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!optionsStepCompleted}>Analysis</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 h-[500px] overflow-y-auto">
            <TabsContent value="stock">
              <Card>                <CardContent className="space-y-4 pt-4">
                  <form onSubmit={handleTickerSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="ticker">Ticker Symbol:</Label>
                      <Input
                        id="ticker"
                        type="text"
                        value={ticker}
                        onChange={handleChange}
                        placeholder="e.g., TSLA"
                      />
                      <Button type="submit" variant="outline">
                        Submit
                      </Button>
                    </div>
                  </form>
                  
                  {tickerPriceLoading ? (
                    <LoadingSpinner />
                  ) : (
                    tickerPrice.match({
                      Just: (price) => (
                        <div className="text-lg font-semibold">
                          Ticker Price: ${roundToHundredth(price)}
                        </div>
                      ),
                      Nothing: () => null,
                    })
                  )}
                </CardContent>
              </Card>
              <div className="mt-4 flex justify-end">
                <Button onClick={nextStep} disabled={!tickerPrice.isJust}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="date">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  {datesLoading ? (
                    <LoadingSpinner />
                  ) : (
                    optionDates.match({
                      Just: (dates) => (
                        <div className="space-y-2">
                          <Label htmlFor="expiration-date">Expiration Date:</Label>
                          <Select onValueChange={handleDateClick}>
                            <SelectTrigger id="expiration-date">
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
                        </div>
                      ),
                      Nothing: () => <p>No expiration dates available.</p>,
                    })
                  )}
                </CardContent>
              </Card>
              <div className="mt-4 flex justify-between">
                <Button onClick={prevStep}>Previous</Button>
                <Button onClick={nextStep} disabled={!dateArrayIndex}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="options">
              <Card>
                <CardContent>
                  {strikePriceTableLoading ? (
                    <LoadingSpinner />
                  ) : (
                    optionsChainData.match({
                      Just: (data) => (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-500">
                            Click on an option to select it for analysis.
                          </p>
                          <div className="max-h-96 overflow-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Strike</TableHead>
                                  <TableHead>Last Price</TableHead>
                                  <TableHead>Change %</TableHead>
                                  <TableHead>In The Money</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(data).map(([row, columns]) => (
                                  <TableRow
                                    key={row}
                                    className={`cursor-pointer hover:bg-gray-100 ${selectedOption === row ? 'bg-blue-100' : ''}`}
                                    onClick={() => {
                                      setSelectedOption(row);
                                      handleCellClick(
                                        columns.lastPrice,
                                        columns.strike,
                                        columns.impliedVolatility,
                                        columns.contractSymbol
                                      );
                                    }}
                                  >
                                    <TableCell>${columns.strike}</TableCell>
                                    <TableCell>${columns.lastPrice}</TableCell>
                                    <TableCell>{roundToHundredth(columns.percentChange)}%</TableCell>
                                    <TableCell className={columns.inTheMoney ? "text-green-500" : "text-red-500"}>
                                      {columns.inTheMoney ? "Yes" : "No"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ),
                      Nothing: () => null,
                    })
                  )}
                </CardContent>
              </Card>
              <div className="mt-4 flex justify-between">
                <Button onClick={prevStep}>Previous</Button>
                <Button onClick={nextStep} disabled={!selectedOption}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              <Card>
                <CardContent>
                  {optionsMatrixLoading ? (
                    <LoadingSpinner />
                  ) : (
                    optionsMatrix.match({
                      Just: () => (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Options Matrix Heatmap</h3>
                            <Button onClick={downloadCSV} variant="outline">Download CSV</Button>
                          </div>
                          <div className="flex space-x-4">
                            <div className="flex-1">
                              <canvas
                                ref={canvasRef}
                                onClick={handleCanvasClick}
                                onMouseMove={handleCanvasMouseMove}
                                onMouseLeave={() => setHoverCell(null)}
                                style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
                              />
                            </div>
                            <div className="w-64">
                              {selectedCell.match({
                                Just: (cell) => (
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Selected Cell Info:</h4>
                                    <p>Date: {cell.date}</p>
                                    <p>Stock Price: ${cell.stockPrice}</p>
                                    <p>Option Value: ${cell.value}</p>
                                    <p>Profit/Loss: {roundToHundredthAndAddSign(cell.profitLoss)}/option</p>
                                  </div>
                                ),
                                Nothing: () => <p>Click on a cell to view details</p>,
                              })}
                            </div>
                          </div>
                        </div>
                      ),
                      Nothing: () => null,
                    })
                  )}
                </CardContent>
              </Card>
              <div className="mt-4 flex justify-start">
                <Button onClick={prevStep}>Previous</Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Add this component for loading states
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-24">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);
