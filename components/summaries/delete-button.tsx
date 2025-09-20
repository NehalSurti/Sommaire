"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePdfSummaryById } from "@/actions/pdfSummaryActions";

export default function DeleteButton() {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    // await deletePdfSummaryById(summary.id)
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 bg-gray-50 border border-gray-200 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4"></Trash2>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Summary</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the summary? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className=" px-2 bg-gray-50 border border-gray-200 hover:text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="bg-gray-900 hover:bg-gray-600"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
